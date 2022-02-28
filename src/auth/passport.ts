import { PassportStatic } from "passport";

import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import User from "src/models/User.model";

export default class PassportConfig {
    private passport: PassportStatic;
    constructor(passport: PassportStatic) {
        this.passport = passport;
    }

    SetStrategy() {
        this.passport.serializeUser( (user, done) => {
            done(null, user);
        });

        this.passport.deserializeUser( (user: User, done) => {
            done(null, user);
        });

        this.passport.use(new JWTStrategy({ 
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET
        }, async (token, done) => {
            try {
                const user = await User.findOne({ where: { id: token.id } });
                if(!user) {
                    return done(null, false);
                }
            
                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }));

        this.passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            session: false
        }, async (email: string, password: string, done) => {
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

