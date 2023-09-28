import { databaseConfig } from './db.config';
import { Sequelize } from 'sequelize-typescript';
import { User } from '../users/entities/user.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const config = databaseConfig.development;
      const urlDatabase = process.env.DB_URL;
      const { dialect } = config;
      const sequelize = new Sequelize(urlDatabase, {
        dialect,
      });
      sequelize.addModels([User]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
