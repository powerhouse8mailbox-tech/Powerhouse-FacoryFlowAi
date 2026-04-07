import Fastify from 'fastify';
import middie from '@fastify/middie';
import fastifyJwt from '@fastify/jwt';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import authRoutes from './backend/modules/auth/routes.js';
import machineRoutes from './backend/modules/machine/routes.js';
import productionRoutes from './backend/modules/production/routes.js';
import inventoryRoutes from './backend/modules/inventory/routes.js';
import aiRoutes from './backend/modules/ai/routes.js';
import scadaRoutes from './backend/modules/scada/routes.js';
import tenantRoutes from './backend/modules/tenant/routes.js';
import notificationRoutes from './backend/modules/notification/routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = Fastify({ logger: true });

  // Register plugins
  await app.register(middie);
  await app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || 'supersecretkey123'
  });

  // Decorate request with authenticate method
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

  // Health check
  app.get('/api/health', async () => {
    return { status: 'ok' };
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
    console.log(`Fastify Server running on http://localhost:${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

startServer();
