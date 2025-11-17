// src/server.ts
import 'reflect-metadata';
import express, { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import swagger from '../swagger.json';

import { AppDataSource } from './data-source';
import { archetypesRouter } from './routes/archetypes.routes';
import { entitiesRouter } from './routes/entities.routes';

const app: Express = express();

// Middleware para parsear JSON do body
app.use(express.json());

// Swagger UI
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swagger));

// Rotas da API
app.use('/api/v1/archetypes', archetypesRouter);
app.use('/api/v1/entities', entitiesRouter);

// Rota de teste simples
app.get('/api/v1/ping', (req, res) => {
  res.json({ ok: true });
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

// Inicializa o TypeORM e só depois sobe o servidor HTTP
AppDataSource.initialize()
  .then(() => {
    console.log('📦 DataSource inicializado com sucesso');

    app.listen(PORT, () => {
      console.log(`✅ Server rodando em http://localhost:${PORT}`);
      console.log(`📚 Swagger em      http://localhost:${PORT}/docs`);
    });
  })
  .catch((err) => {
    console.error('❌ Erro ao iniciar DataSource', err);
    process.exit(1);
  });
