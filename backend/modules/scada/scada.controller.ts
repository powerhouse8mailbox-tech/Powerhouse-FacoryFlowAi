import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import { mqttClient } from '../../shared/event-bus/mqtt.client.js';
import { query } from '../../config/db.js';

interface ScadaPayload {
  machine_id: string;
  status: 'running' | 'stopped' | 'warning';
  temperature: number;
  vibration: number;
  cycle_time: number;
}

export class ScadaController {
  constructor(private fastify: FastifyInstance) {}

  async ingestData(request: FastifyRequest<{ Body: ScadaPayload }>, reply: FastifyReply) {
    const user = request.user as any;
    const tenantId = user.tenant_id;
    const data = request.body;

    try {
      // 1. Save to DB (TimescaleDB/Postgres)
      await query(
        `INSERT INTO scada_telemetry (tenant_id, machine_id, temperature, vibration, cycle_time) 
         VALUES ($1, $2, $3, $4, $5)`,
        [tenantId, data.machine_id, data.temperature, data.vibration, data.cycle_time]
      );

      // 2. Publish to Event Bus (MQTT)
      if (mqttClient && mqttClient.connected) {
        const topic = `tenant/${tenantId}/machine/${data.machine_id}/status`;
        mqttClient.publish(topic, JSON.stringify({
          ...data,
          timestamp: new Date().toISOString()
        }));
      }

      // 3. Broadcast to connected WebSockets
      if (this.fastify.websocketServer) {
        this.fastify.websocketServer.clients.forEach(client => {
          if (client.readyState === 1) {
            client.send(JSON.stringify({ type: 'SCADA_UPDATE', payload: data }));
          }
        });
      }

      return reply.code(202).send({ success: true, message: 'Data ingested and published' });
    } catch (err: any) {
      this.fastify.log.error(err);
      return reply.status(500).send({ error: err.message });
    }
  }
}
