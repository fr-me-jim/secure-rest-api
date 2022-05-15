import { PassportStatic } from "passport";
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTStrategy, ExtractJwt, VerifiedCallback } from "passport-jwt";
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

// model
import User from "../models/User.model";

// interfaces
import { 
    UserAttributes,
    IUserRepository 
} from "../interfaces/User.interface";

export default class PassportConfig {
    private passport: PassportStatic;
    private UsersRepository: IUserRepository; 

    constructor(passport: PassportStatic, repository: IUserRepository) {
        this.passport = passport;
        this.UsersRepository = repository;
    }

    public readonly SetStrategy = (): PassportStatic => {
        this.passport.serializeUser( (user, done: VerifiedCallback) => {
            return done(null, user);
        });

        this.passport.deserializeUser( (user: false | User | null | undefined, done: VerifiedCallback) => {
            return done(null, user);
        });

        this.passport.use(new JWTStrategy({ 
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET!
        }, this.getUserByJWT));

        this.passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            session: false
        }, this.checkUserLocal));

    
        return this.passport;
    };

    /**
     * GetUserByJWT
     */
    private getUserByJWT = async (token: { id: string; }, done: VerifiedCallback): Promise<void> => {
        try {
            const user = await this.UsersRepository.getUserById(token.id);
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
            const [ user ] = await this.UsersRepository.getUsersByAttributes(({ email } as UserAttributes));
            if (!user) return done(null, false);
            console.log('[User Password]: ', user.password);
            const isValid: boolean = await user.isValidPassword(user.password, password);
            if (!isValid) return done(null, false);

            return done(null, user);
        } catch (error) {
            return done(error, false);  
        }
    }
};

