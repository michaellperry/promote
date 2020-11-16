import * as Express from "express";
import * as passport from "passport";
import { Strategy as TwitterStrategy } from "passport-twitter";

export function configureAuthenticationTwitter(app: Express.Application) {
    const TWITTER_CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY;
    const TWITTER_CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET;
    const TWITTER_CALLBACK_URL = process.env.TWITTER_CALLBACK_URL || "http://localhost:8080/auth/twitter/callback";

    if (!TWITTER_CONSUMER_KEY || !TWITTER_CONSUMER_SECRET) {
        const message = "You must set the TWITTER_CONSUMER_KEY and TWITTER_CONSUMER_SECRET environment variables.";
        console.error(message);
        throw new Error(message)
    }

    passport.use(new TwitterStrategy({
        consumerKey: TWITTER_CONSUMER_KEY,
        consumerSecret: TWITTER_CONSUMER_SECRET,
        callbackURL: TWITTER_CALLBACK_URL
    }, function (token, tokenSecret, profile, cb) {
        cb(null, {
            provider: profile.provider,
            id: profile.id,
            profile: {
                username: profile.username,
                name: profile.name,
                displayName: profile.displayName
            }
        });
    }));

    app.get('/auth/twitter', passport.authenticate('twitter'));
    app.get('/auth/twitter/callback', passport.authenticate('twitter', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));
}