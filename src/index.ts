import 'reflect-metadata';
import express from 'express';
import jwt from 'express-jwt';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { getConnectionManager } from 'typeorm';
import { APP_PORT, authChecker, getConn, JWT_SECRET } from './utils';
import { Context, ExtendedRequest } from './types';
import UserEntity from './entities/User';
import AuthResolver from './resolvers/AuthResolver';
import UserResolver from './resolvers/UserResolver';

const app = express();
const path = '/graphql';
async function main() {
  const schema = await buildSchema({
    resolvers: [UserResolver, AuthResolver],
    emitSchemaFile: true,
    authChecker,
  });

  const manager = getConnectionManager();
  const conn = manager.create(getConn());

  const server = new ApolloServer({
    schema,
    context: (opts): Context => {
      const req: ExtendedRequest = opts.req;
      const user = req.user;
      const context: Context = { user };
      return context;
    },
  });

  app.use(
    path,
    jwt({
      secret: JWT_SECRET,
      credentialsRequired: false,
      algorithms: ['HS256'],
    })
  );

  server.applyMiddleware({ app, path });

  conn.connect().then(() => console.log(`Database online`));
  app.listen(APP_PORT, () => {
    console.log(`Server at http://localhost:4000${server.graphqlPath}`);
  });
}

main();
