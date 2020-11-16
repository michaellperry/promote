import { JinagaServer, AuthorizationRules } from 'jinaga';
import { Express, Handler } from 'express';
import { authorizeVisit } from '@shared/model/visit';
import { authorizeUser } from '@shared/model/user';

export function configureJinaga(app: Express, authenticate: Handler) {
  const pgConnection = process.env.JINAGA_POSTGRESQL ||
        'postgresql://dev:devpw@localhost:5432/promote';
  const { handler } = JinagaServer.create({
    pgKeystore: pgConnection,
    pgStore: pgConnection,
    authorization: configureAuthorization
  });

  app.use('/jinaga', authenticate, handler);
}

function configureAuthorization(a: AuthorizationRules) {
  return (a
    .with(authorizeVisit)
    .with(authorizeUser)
  );
}
