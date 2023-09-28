import { Dialect } from 'sequelize';

export const databaseConfig = {
  development: {
    urlDatabase: process.env.DB_URL,
    dialect: process.env.DB_DIALECT as Dialect,
  },
};
