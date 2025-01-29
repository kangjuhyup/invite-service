import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

config();

const env = process.env;

export default new DataSource({
  type: env.DB_TYPE as any,
  host: env.DB_HOST,
  port: parseInt(env.DB_PORT),
  username: env.DB_USER,
  password: env.DB_PWD,
  database: env.DB_NAME,
  synchronize: false,
  entities: [join(__dirname, '../entity/**/*.{ts,js}')],
  migrations: [join(__dirname, '../migrations/*.{ts,js}')],
});
