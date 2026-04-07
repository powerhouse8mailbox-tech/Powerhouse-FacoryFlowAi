import { FastifyInstance } from 'fastify';
import { query } from '../../config/db.js';

export default async function scadaRoutes(fastify: FastifyInstance) {
  // SCADA might use a specialized API key or JWT
  fastify.addHook('preValidation', (fastify as any).authenticate);

  fastify.post('/data', async (request: any, reply) => {
    const tenantId = request.user.tenant_id;
    const { machine_id, temperature, vibration, cycle_time } = request.body;
    
    try {
      const res = await query(
        `INSERT INTO scada_telemetry (tenant_id, machine_id, temperature, vibration, cycle_time) 
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [tenantId, machine_id, temperature, vibration, cycle_time]
      );
      
      // Here you could also publish to MQTT or Kafka for real-time processing
      
      return res.rows[0];
    } catch (err: any) {
      reply.status(500).send({ error: err.message });
    }
  });
}
