import * as Express from "express";
import * as passport from "passport";
import { Strategy as OAuth2Strategy, VerifyCallback } from "passport-oauth2";

export function configureAuthenticationAzureDevOps(app: Express.Application) {
    const AZURE_DEVOPS_AUHTOIRIZATION_URL = process.env.AZURE_DEVOPS_AUHTOIRIZATION_URL || "https://app.vssps.visualstudio.com/oauth2/authorize";
    const AZURE_DEVOPS_TOKEN_URL = process.env.AZURE_DEVOPS_TOKEN_URL || "https://app.vssps.visualstudio.com/oauth2/token";
    const AZURE_DEVOPS_CALLBACK_URL = process.env.TWITTER_CALLBACK_URL || "http://localhost:8080/auth/azuredevops/callback";
    const AZURE_DEVOPS_CLIENT_ID = process.env.AZURE_DEVOPS_CLIENT_ID;
    const AZURE_DEVOPS_CLIENT_SECRET = process.env.AZURE_DEVOPS_CLIENT_SECRET;

    if (!AZURE_DEVOPS_CLIENT_ID || !AZURE_DEVOPS_CLIENT_SECRET) {
        const message = "You must set the AZURE_DEVOPS_CLIENT_ID and AZURE_DEVOPS_CLIENT_SECRET environment variables.";
        console.error(message);
        throw new Error(message)
    }

    passport.use(new OAuth2Strategy({
        authorizationURL: AZURE_DEVOPS_AUHTOIRIZATION_URL,
        tokenURL: AZURE_DEVOPS_TOKEN_URL,
        clientID: AZURE_DEVOPS_CLIENT_ID,
        clientSecret: AZURE_DEVOPS_CLIENT_SECRET,
        callbackURL: AZURE_DEVOPS_CALLBACK_URL
    }, function (accessToken: string, refreshToken: string, profile: any, verified: VerifyCallback) {
        verified(null, {
            provider: profile.provider,
            id: profile.id,
            profile: {
                username: profile.username,
                name: profile.name,
                displayName: profile.displayName
            }
        });
    }));

    app.get('/auth/azuredevops', passport.authenticate('oauth2'));
    app.get('/auth/azuredevops/callback', passport.authenticate('oauth2', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));
}