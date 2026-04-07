import { FastifyRequest, FastifyReply } from 'fastify';

export async function verifyTenantAuth(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.code(401).send({ error: 'Unauthorized or missing Tenant ID' });
  }
}
