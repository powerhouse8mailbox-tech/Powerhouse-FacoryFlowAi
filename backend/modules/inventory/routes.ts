import { FastifyInstance } from 'fastify';
import { query } from '../../config/db.js';

export default async function inventoryRoutes(fastify: FastifyInstance) {
  fastify.addHook('preValidation', (fastify as any).authenticate);

  fastify.get('/', async (request: any, reply) => {
    const tenantId = request.user.tenant_id;
    try {
      const res = await query('SELECT * FROM inventory WHERE tenant_id = $1', [tenantId]);
      return res.rows;
    } catch (err: any) {
      reply.status(500).send({ error: err.message });
    }
  });

  fastify.post('/update', async (request: any, reply) => {
    const tenantId = request.user.tenant_id;
    const { product_id, type, quantity, location } = request.body;
    
    try {
      // Upsert logic
      const res = await query(
        `INSERT INTO inventory (tenant_id, product_id, type, quantity, location) 
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (tenant_id, product_id) 
         DO UPDATE SET quantity = inventory.quantity + EXCLUDED.quantity, updated_at = CURRENT_TIMESTAMP
         RETURNING *`,
        [tenantId, product_id, type, quantity, location]
      );
      return res.rows[0];
    } catch (err: any) {
      reply.status(500).send({ error: err.message });
    }
  });
}
