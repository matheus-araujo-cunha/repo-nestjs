import { DataSource } from 'typeorm';

import { config } from 'dotenv';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: ['dist/**/*.entity{.ts,.js}'],
  logging: true,
  synchronize: false,
  migrationsRun: false,
  migrationsTableName: 'migration',
  migrations: ['dist/**/migrations/*.js'],
  ssl: false,
});
