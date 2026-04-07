import { FastifyInstance } from 'fastify';
import { query } from '../../config/db.js';

export default async function tenantRoutes(fastify: FastifyInstance) {
  fastify.addHook('preValidation', (fastify as any).authenticate);

  fastify.get('/', async (request: any, reply) => {
    // Only super_admin should see all tenants
    if (request.user.role !== 'super_admin') {
      return reply.status(403).send({ error: 'Forbidden' });
    }

    try {
      const res = await query('SELECT * FROM tenants');
      return res.rows;
    } catch (err: any) {
      reply.status(500).send({ error: err.message });
    }
  });

  fastify.get('/me', async (request: any, reply) => {
    const tenantId = request.user.tenant_id;
    try {
      const res = await query('SELECT * FROM tenants WHERE id = $1', [tenantId]);
      return res.rows[0];
    } catch (err: any) {
      reply.status(500).send({ error: err.message });
    }
  });
}
