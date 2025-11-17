// src/data-source.ts
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Archetype } from './entities/Archetype';
import { EntityModel } from './entities/EntityModel';
import { EntityAttribute } from './entities/EntityAttribute';
import { AdoptionRequest } from './entities/AdoptionRequest';
import { AppUser } from './entities/AppUser';

// garante que nao eh undefined
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  throw new Error('DATABASE_URL is not set in environment variables');
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: dbUrl,
  ssl: {
    rejectUnauthorized: false,
  },
  synchronize: false,
  logging: true,
  entities: [Archetype, EntityModel, EntityAttribute, AdoptionRequest, AppUser],
  migrations: [],
});
