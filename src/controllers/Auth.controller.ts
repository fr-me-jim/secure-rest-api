import jwt, { Algorithm } from "jsonwebtoken";
import { VerifiedCallback } from "passport-jwt";
import { Request, Response } from 'express';

// User model
import User from '../models/User.model';

// interfaces
import { IUserRepository, UserAttributes, UserCreate } from "../interfaces/User.interface";
import { ITokenRepositories, JWTAccessSignInfo } from 'src/interfaces/Token.interface';

class AuthController {
    private jwtSecret: jwt.Secret;
    private jwtOptions: jwt.SignOptions;

    private TokenRepository: ITokenRepositories;
    protected UsersRepository: IUserRepository;
    
    constructor( userRepository: IUserRepository, tokenRepository: ITokenRepositories ) {
        this.UsersRepository = userRepository;
        this.TokenRepository = tokenRepository;
        this.jwtSecret = process.env.JWT_SECRET!;
        this.jwtOptions = {
            algorithm: (process.env.JWT_ALG! as Algorithm) || undefined,
            expiresIn: parseInt(process.env.JWT_EXPIRATION! || "0") || undefined,
            issuer: process.env.JWT_ISSUER!,
            audience: process.env.JWT_AUDIENCE!
        };
    };

    /**
     * @method CreateNewJWTToken
     * @description Creates a new JWT token, using the user's info, the JWT secret and teh JWT Options Settings of the App 
     */
     public readonly createNewJWTToken = ( info: JWTAccessSignInfo ): string => {
        if (!info) throw new Error("Wrong number of parameters");

        const token = jwt.sign( info, this.jwtSecret, this.jwtOptions);  
        return token;
    };

    /**
     * AddToBlacklist
     */
     public readonly addToBlacklist = async (req: Request, res: Response): Promise<Response> => {
        try {
            const user_id: string = (req.user! as User).id;
            const [, token]: string[] = req.headers.authorization!.split(' ');
            const result = await this.TokenRepository.createNewBlacklistedToken(token, user_id);
            if (!result) return res.sendStatus(500);

            return res.sendStatus(200);
        } catch (error: any) {
            res.sendStatus(500);
            throw error;
        }
    };

    /**
     * GetUserByJWT
     */
    public readonly getUserByJWT = async (token: { id: string; }, done: VerifiedCallback): Promise<void> => {
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
    public readonly checkUserLocal = async (email: string, password: string, done: VerifiedCallback): Promise<void> => {
        try {
            const [ user ] = await this.UsersRepository.getUsersByAttributes(({ email } as UserAttributes));
            if (!user) return done(null, false);

            const isValid: boolean = await user.isValidPassword(password, user.password);
            if (!isValid) return done(null, false);

            return done(null, user);
        } catch (error) {
            return done(error, false);  
        }
    }

    /**
     * RegisterUser
     */
     public readonly registerUser = async (req: Request, res: Response): Promise<Response> => {
        try {
            const user: UserCreate | undefined = req.body;
            if(!user) return res.sendStatus(400);

            const result = await this.UsersRepository.createNewUser(user);
            if(!result) return res.sendStatus(500);
            
            const token = this.createNewJWTToken({ id: result!.id });

            return res.send({ token }).status(201);
        } catch (error: unknown) {
            res.sendStatus(500);
            throw error;
        }  
    };

    /**
     * Login
     */
     public readonly login = (req: Request, res: Response): Response => {
        try {
            if (!req.user) return res.sendStatus(401);

            const token = this.createNewJWTToken({ id: (req.user! as User).id });

            return res.send({ token }).status(200);
        } catch (error: unknown) {  
            res.sendStatus(500);
            throw error;
        }
    };

     /**
     * Logout
     */
      public readonly logout = async (req: Request, res: Response) => await this.addToBlacklist(req, res);
        
};
    

export default AuthController;