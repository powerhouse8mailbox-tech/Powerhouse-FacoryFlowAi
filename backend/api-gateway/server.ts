import Fastify from 'fastify';
import middie from '@fastify/middie';
import fastifyJwt from '@fastify/jwt';
import websocket from '@fastify/websocket';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import authRoutes from '../modules/auth/routes.js';
import machineRoutes from '../modules/machine/routes.js';
import productionRoutes from '../modules/production/routes.js';
import inventoryRoutes from '../modules/inventory/routes.js';
import aiRoutes from '../modules/ai/routes.js';
import scadaRoutes from '../modules/scada/routes.js';
import tenantRoutes from '../modules/tenant/routes.js';
import notificationRoutes from '../modules/notification/routes.js';
import { setupMqtt } from '../shared/event-bus/mqtt.client.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = Fastify({ logger: true });

  // Register plugins
  await app.register(middie);
  await app.register(websocket);
  await app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || 'supersecretkey123'
  });

  // Decorate request with authenticate method (for legacy routes)
  app.decorate('authenticate', async function (request: any, reply: any) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  // API Routes
  app.register(authRoutes, { prefix: '/api/auth' });
  app.register(tenantRoutes, { prefix: '/api/tenants' });
  app.register(machineRoutes, { prefix: '/api/machines' });
  app.register(productionRoutes, { prefix: '/api/production' });
  app.register(inventoryRoutes, { prefix: '/api/inventory' });
  app.register(aiRoutes, { prefix: '/api/ai' });
  app.register(scadaRoutes, { prefix: '/api/scada' });
  app.register(notificationRoutes, { prefix: '/api/notifications' });

  // WebSocket Route for Real-time UI
  app.register(async function (fastify) {
    fastify.get('/ws', { websocket: true }, (connection, req) => {
      connection.on('message', message => {
        app.log.info(`WS message received: ${message}`);
      });
      connection.send(JSON.stringify({ type: 'CONNECTION_ESTABLISHED' }));
    });
  });

  // Initialize MQTT Event Bus
  await setupMqtt(app);

  // Health check
  app.get('/api/health', async () => {
    return { status: 'ok', architecture: 'unified-microservices' };
  });

  // Vite Integration
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    // Serve static files in production
    app.use(async (req: any, res: any, next: any) => {
      const url = req.url;
      const filePath = path.join(distPath, url);
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const stream = fs.createReadStream(filePath);
        res.writeHead(200);
        stream.pipe(res);
      } else {
        next();
      }
    });
    
    // SPA fallback
    app.use((req: any, res: any) => {
      if (!req.url.startsWith('/api')) {
        const stream = fs.createReadStream(path.join(distPath, 'index.html'));
        res.writeHead(200, { 'Content-Type': 'text/html' });
        stream.pipe(res);
      } else {
        res.statusCode = 404;
        res.end('Not Found');
      }
    });
  }

  const PORT = 3000;
  try {
    await app.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`Unified API Gateway running on http://localhost:${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

startServer();
