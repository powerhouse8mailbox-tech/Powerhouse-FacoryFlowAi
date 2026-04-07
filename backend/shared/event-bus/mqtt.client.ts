import mqtt from 'mqtt';
import { FastifyInstance } from 'fastify';

export let mqttClient: mqtt.MqttClient;

export async function setupMqtt(server: FastifyInstance) {
  const brokerUrl = process.env.MQTT_URL || 'mqtt://localhost:1883';
  
  try {
    mqttClient = mqtt.connect(brokerUrl);

    mqttClient.on('connect', () => {
      server.log.info(`Connected to MQTT broker at ${brokerUrl}`);
      // Subscribe to relevant topics
      mqttClient.subscribe('tenant/+/machine/+/status');
    });

    mqttClient.on('message', (topic, message) => {
      server.log.info(`Received message on ${topic}: ${message.toString()}`);
      // Broadcast to websockets if needed
      if (server.websocketServer) {
        server.websocketServer.clients.forEach(client => {
          if (client.readyState === 1) {
            client.send(JSON.stringify({ topic, payload: JSON.parse(message.toString()) }));
          }
        });
      }
    });

    mqttClient.on('error', (err) => {
      server.log.error(`MQTT Error: ${err.message}`);
    });
  } catch (err) {
    server.log.error(`Failed to connect to MQTT: ${err}`);
  }
}
