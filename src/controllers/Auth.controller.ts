import jwt, { Algorithm } from "jsonwebtoken";
import { NextFunction, Request, Response } from 'express';

// User model
import User from '../models/User.model';

// interfaces
// import { IAuthController } from "../interfaces/Auth.interface";
import { IUserRepository, UserCreate } from "../interfaces/User.interface";
import { ITokenRepositories, JWTAccessSignInfo } from '../interfaces/Token.interface';

export default class AuthController {
    private jwtSecret: jwt.Secret;
    private jwtOptions: jwt.SignOptions;

    private UsersRepository: IUserRepository;
    private TokenRepository: ITokenRepositories;
    
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
     public readonly addToBlacklist = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const user_id: string = (req.user! as User).id;
            const [, token]: string[] = req.headers.authorization!.split(' ');
            const result = await this.TokenRepository.createNewBlacklistedToken(token, user_id);
            if (!result) return res.sendStatus(500);

            return res.sendStatus(200);
        } catch (error: any) {
            next(error);
        }
    };

    /**
     * RegisterUser
     */
     public readonly registerUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const user: UserCreate | undefined = req.body;
            if(!user || user.password.length < 8) return res.sendStatus(400);

            const result = await this.UsersRepository.createNewUser(user);
            if(!result) return res.sendStatus(500);
            
            const token = this.createNewJWTToken({ id: result!.id });

            return res.send({ token }).status(201);
        } catch (error: unknown) {
            next(error);
        }  
    };

    /**
     * Login
     */
     public readonly login = (req: Request, res: Response, next: NextFunction): Response | void => {
        try {
            if (!req.user) return res.sendStatus(401);

            const token = this.createNewJWTToken({ id: (req.user! as User).id });

            return res.send({ token }).status(200);
        } catch (error: unknown) {  
            next(error);
        }
    };

     /**
     * Logout
     */
     public async logout(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        return await this.addToBlacklist(req, res, next);
    }
        
};