import { FastifyInstance } from 'fastify';
import { query } from '../../config/db.js';

export default async function machineRoutes(fastify: FastifyInstance) {
  fastify.addHook('preValidation', (fastify as any).authenticate);

  fastify.get('/', async (request: any, reply) => {
    const tenantId = request.user.tenant_id;
    try {
      const res = await query('SELECT * FROM machines WHERE tenant_id = $1', [tenantId]);
      return res.rows;
    } catch (err: any) {
      reply.status(500).send({ error: err.message });
    }
  });

  fastify.post('/', async (request: any, reply) => {
    const tenantId = request.user.tenant_id;
    const { name, type } = request.body;
    try {
      const res = await query(
        'INSERT INTO machines (tenant_id, name, type) VALUES ($1, $2, $3) RETURNING *',
        [tenantId, name, type]
      );
      return res.rows[0];
    } catch (err: any) {
      reply.status(500).send({ error: err.message });
    }
  });
}
