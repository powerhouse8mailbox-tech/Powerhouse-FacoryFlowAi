import { FastifyInstance } from 'fastify';

export default async function notificationRoutes(fastify: FastifyInstance) {
  fastify.addHook('preValidation', (fastify as any).authenticate);

  fastify.post('/send', async (request: any, reply) => {
    const tenantId = request.user.tenant_id;
    const { type, message, recipient } = request.body;
    
    // In a real scenario, this would integrate with SendGrid, Twilio, or WhatsApp API
    console.log(`[Notification - Tenant ${tenantId}] Sending ${type} to ${recipient}: ${message}`);
    
    return {
      status: 'sent',
      type,
      recipient,
      timestamp: new Date().toISOString()
    };
  });
}
