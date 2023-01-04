import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const datasource = new DataSource({
  type: 'postgres',
  port: +process.env.DB_PORT,
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/**/migrations/*{.ts,.js}'],
});

datasource.initialize();

export default datasource;
