import { PassportStatic } from "passport";
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTStrategy, ExtractJwt, VerifiedCallback } from "passport-jwt";
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

// model
import User from "../models/User.model";

// controllers
import AuthController from '../controllers/Auth.controller';

export default class PassportConfig {
    private passport: PassportStatic;
    constructor(passport: PassportStatic) {
        this.passport = passport;
    }

    SetStrategy() {
        this.passport.serializeUser( (user, done: VerifiedCallback) => {
            console.log('[Serialize]', user)
            return done(null, user);
        });

        this.passport.deserializeUser( (user: false | User | null | undefined, done: VerifiedCallback) => {
            console.log('[Deserialize]', user)
            return done(null, user);
        });

        this.passport.use(new JWTStrategy({ 
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET
        }, AuthController.getUserByJWT));

        this.passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            session: false
        }, AuthController.checkUserLocal));

    
        return this.passport;
    }
};

