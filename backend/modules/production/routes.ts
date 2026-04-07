import { FastifyInstance } from 'fastify';
import { query } from '../../config/db.js';

export default async function productionRoutes(fastify: FastifyInstance) {
  fastify.addHook('preValidation', (fastify as any).authenticate);

  fastify.post('/update', async (request: any, reply) => {
    const tenantId = request.user.tenant_id;
    const { machine_id, work_order_id, product_name, quantity_produced, status } = request.body;
    
    try {
      const res = await query(
        `INSERT INTO production (tenant_id, machine_id, work_order_id, product_name, quantity_produced, status) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [tenantId, machine_id, work_order_id, product_name, quantity_produced, status]
      );
      return res.rows[0];
    } catch (err: any) {
      reply.status(500).send({ error: err.message });
    }
  });

  fastify.get('/', async (request: any, reply) => {
    const tenantId = request.user.tenant_id;
    try {
      const res = await query('SELECT * FROM production WHERE tenant_id = $1 ORDER BY recorded_at DESC', [tenantId]);
      return res.rows;
    } catch (err: any) {
      reply.status(500).send({ error: err.message });
    }
  });
}
