import * as Express from 'express';
import * as passport from 'passport';
import { configureAuthenticationTwitter } from './authentication-strategy/twitter';

export function configureAuthentication(app: Express.Application) {
  passport.serializeUser((user, done) => {
    done(null, JSON.stringify(user));
  });
  passport.deserializeUser((id, done) => {
    done(null, JSON.parse(<string>id));
  });

  app.use(passport.initialize());
  app.use(passport.session());

  configureAuthenticationTwitter(app);

  const authenticate: Express.Handler = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.sendStatus(403);
  };
  return authenticate;
}
