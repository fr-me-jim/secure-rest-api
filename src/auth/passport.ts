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
            return done(null, user);
        });

        this.passport.deserializeUser( (user: false | User | null | undefined, done: VerifiedCallback) => {
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
        }, async (email: string, password: string, done: VerifiedCallback): Promise<void> => {
            try {
                const user = await User.findOne({ where: { email } });
                if (!user) {
                    return done(401, false, { message: 'User not found' });
                }

                const isValid: boolean = await User.isValidPassword(password, user.password);
                if (!isValid) {
                    return done(401, false, { message: 'Wrong credentials' });
                }

                return done(null, user, { message: 'Login success' });
            } catch (error) {
                return done(error);  
            }
        }));

    
        return this.passport;
    }
};

