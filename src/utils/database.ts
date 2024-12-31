import { Sequelize } from 'sequelize';
import { env } from './';

export const sequelize = new Sequelize(env('DB_NAME'), env('DB_USER'), env('DB_PASSWORD'), {
  host: env('DB_HOST'),
  dialect: 'postgres',
  logging: false,
});
