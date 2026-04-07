import { FastifyInstance } from 'fastify';
import { verifyTenantAuth } from '../../api-gateway/middleware/auth.js';
import { ScadaController } from './scada.controller.js';

export default async function scadaRoutes(fastify: FastifyInstance) {
  const controller = new ScadaController(fastify);
  fastify.post('/data', { preValidation: [verifyTenantAuth] }, controller.ingestData.bind(controller));
}
