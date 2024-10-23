import { DataSource } from 'typeorm';
import 'dotenv/config';

export const LetterDataSource = new DataSource({
  type: process.env.DB_TYPE as any,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/../entity/*.{ts,js}'],
  migrations: [__dirname + '/../migration/*.{ts,js}'],
  synchronize: process.env.DB_SYNC === 'true' || false,
});
