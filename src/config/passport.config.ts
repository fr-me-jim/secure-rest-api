import { Request } from "express";
import { PassportStatic } from "passport";
import { Strategy as LocalStrategy } from 'passport-local';
// import { Strategy as GoogleStrategy } from 'passport-google-oidc';
import { Strategy as JWTStrategy, VerifiedCallback } from "passport-jwt";
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

// model
import User from "../models/User.model";

// interfaces
import { 
    IUserRepository,
} from "../interfaces/User.interface";

export default class PassportConfig {
    private passport: PassportStatic;
    private UsersRepository: IUserRepository; 

    constructor(passport: PassportStatic, repository: IUserRepository) {
        this.passport = passport;
        this.UsersRepository = repository;
    };

    private readonly cookieExtractor = (req: Request): string => req.signedCookies['access_token'] || "";

    public readonly SetStrategy = (): PassportStatic => {
        this.passport.serializeUser( (user, done: VerifiedCallback) => {
            return done(null, user);
        });

        this.passport.deserializeUser( (user: false | User | null | undefined, done: VerifiedCallback) => {
            return done(null, user);
        });

        this.passport.use(new JWTStrategy({ 
            jwtFromRequest: this.cookieExtractor,
            secretOrKey: process.env.JWT_SECRET!
        }, this.getUserByJWT));

        this.passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            session: false
        }, this.checkUserLocal));

        // this.passport.use(new GoogleStrategy({
        //     clientID: process.env.GOOGLE_CLIENT_ID,
        //     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        //     callbackURL: "https://tfm.jediupc.com/api/auth/google/callback"
        // }, async (issuer, profile, done: VerifiedCallback) => {
        //     try {
        //         // const [ user ] = await User.findOrCreate({ 
        //         //     where: { id: profile.id },
        //         //     defaults: { 
        //         //         username: profile.displayName
        //         //     },
        //         //     returning: true, raw: true
        //         // });
        //         // if (!profile || !user) return done(null, false);

        //         return done(null, false);
        //     } catch (error) {
        //         throw error;
        //     }
        // }));

    
        return this.passport;
    };

    /**
     * GetUserByJWT
     */
    private getUserByJWT = async (token: { id: string; }, done: VerifiedCallback): Promise<void> => {
        try {
            const user = await this.UsersRepository.getUserById(token.id, ["password"]);
            if (!user) return done(null, false);

            return done(null, user);
        } catch (error) {
            return done(error, null);
        }
    };


    /**
     * CheckUserLocal
     */
    private checkUserLocal = async (email: string, password: string, done: VerifiedCallback): Promise<void> => {
        try {
            const user = await this.UsersRepository.getUserByEmail(email, []);
            if (!user) return done(null, false);
            
            const isValid: boolean = await new User(user).isValidPassword(password);
            if (!isValid) return done(null, false);

            return done(null, user);
        } catch (error) {
            return done(error, false);  
        }
    }
};

