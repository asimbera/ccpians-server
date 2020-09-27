import { AuthChecker } from 'type-graphql';
import { ConnectionOptions } from 'typeorm';
import UserEntity from './entities/User';
import { Context } from './types';

export const JWT_SECRET = process.env.JWT_SECRET || 'Everyb0dyKnow$My$ecret';
export const APP_PORT = process.env.PORT || 3000;

export function getConn(): ConnectionOptions {
  return process.env.NODE_ENV === 'production' ? CONN_PROD : CONN_DEV;
}
const CONN_DEV: ConnectionOptions = {
  type: 'sqlite',
  database: './dev.sql',
  synchronize: true,
  entities: [UserEntity],
};

const CONN_PROD: ConnectionOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: true,
  entities: [UserEntity],
};

export const authChecker: AuthChecker<Context> = (
  { context: { user } },
  roles
) => {
  console.log(user);
  console.log(roles);

  if (roles.length === 0) {
    return user != undefined;
  }

  if (!user) {
    return false;
  }

  if (roles.includes(user.scope)) {
    return true;
  }

  return false;
};
