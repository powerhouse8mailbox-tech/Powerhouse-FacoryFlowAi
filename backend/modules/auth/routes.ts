import { FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';
import { query } from '../../config/db.js';

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/register', async (request, reply) => {
    const { email, password, tenant_name, role } = request.body as any;
    
    try {
      // 1. Create Tenant
      const tenantRes = await query(
        'INSERT INTO tenants (name) VALUES ($1) RETURNING id',
        [tenant_name || 'Default Tenant']
      );
      const tenantId = tenantRes.rows[0].id;

      // 2. Hash Password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // 3. Create User
      const userRes = await query(
        'INSERT INTO users (tenant_id, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, email, role',
        [tenantId, email, passwordHash, role || 'factory_admin']
      );

      const user = userRes.rows[0];
      const token = fastify.jwt.sign({ id: user.id, tenant_id: tenantId, role: user.role });

      return { token, user };
    } catch (err: any) {
      reply.status(500).send({ error: err.message });
    }
  });

  fastify.post('/login', async (request, reply) => {
    const { email, password } = request.body as any;

    try {
      const userRes = await query('SELECT * FROM users WHERE email = $1', [email]);
      if (userRes.rows.length === 0) {
        return reply.status(401).send({ error: 'Invalid credentials' });
      }

      const user = userRes.rows[0];
      const isValid = await bcrypt.compare(password, user.password_hash);

      if (!isValid) {
        return reply.status(401).send({ error: 'Invalid credentials' });
      }

      const token = fastify.jwt.sign({ id: user.id, tenant_id: user.tenant_id, role: user.role });
      return { token, user: { id: user.id, email: user.email, role: user.role, tenant_id: user.tenant_id } };
    } catch (err: any) {
      reply.status(500).send({ error: err.message });
    }
  });
}
