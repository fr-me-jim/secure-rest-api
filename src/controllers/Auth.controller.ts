import validator from 'validator';
import jwt, { Algorithm } from "jsonwebtoken";
import { NextFunction, Request, Response } from 'express';

// User model
import User from '../models/User.model';

// error
import TypeGuardError from '../errors/TypeGuardError.error';

// interfaces
// import { IAuthController } from "../interfaces/Auth.interface";
import { IUserRepository, UserCreate } from "../interfaces/User.interface";
import { ITokenRepositories, JWTAccessSignInfo } from '../interfaces/Token.interface';

// utils
import logger from '../config/logger.config';
import { sanitizeObject } from '../utils/helpers';
import { 
    isUserCreate
} from "../validators/User.typeguards";

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
            const id: string = (req.user! as User).id;
            if (!id || !validator.isUUID(id)) {
                logger.error('GET /logout - Request ID param wrong type or missing!');
                throw new TypeGuardError("User Login - Request ID param wrong type or missing!");
            };
            
            const token: string = req.signedCookies['access_token'];
            if ( !token || !validator.isJWT(token) ) {
                logger.error('GET /logout - Request Token wrong type!');
                throw new TypeGuardError("Logout User - Request Token wrong type!");
            };

            const result = await this.TokenRepository.createNewBlacklistedToken(token, id);
            if (!result) return res.sendStatus(500);

            return res.sendStatus(200);
        } catch (error: unknown) {
            next(error);
        }
    };

    /**
     * RegisterUser
     */
     public readonly registerUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        logger.info("In [POST] - /signin");
        try {
            const user: UserCreate = req.body;
            if(!user || !isUserCreate(user) || user.password.length < 20) {
                logger.error('POST /signin - Request body payload wrong type!');
                throw new TypeGuardError("Register User - Request body payload wrong type!");
            };
            sanitizeObject(user);

            const result = await this.UsersRepository.createNewUser(user);
            if(!result) return res.sendStatus(500);
            
            const token = this.createNewJWTToken({ id: result!.id });
            
            return res.status(201).cookie('access_token', token, { httpOnly: true, secure: true, signed: true }).end();
        } catch (error: unknown) {
            next(error);
        }  
    };

    /**
     * Login
     */
     public readonly login = (req: Request, res: Response, next: NextFunction): Response | void => {
        logger.info("In [POST] - /login");
        try {
            if (!req.user) return res.sendStatus(401);
            if (!req.user.id || !validator.isUUID(req.user.id)) {
                logger.error('POST /login - Request body payload wrong type!');
                throw new TypeGuardError("Login User - User ID wrong type!");
            };

            const token = this.createNewJWTToken({ id: (req.user! as User).id });

            return res.status(200).cookie('access_token', token, { 
                secure: true, 
                signed: true,
                httpOnly: true, 
                maxAge: 72 * 60
            }).end();
        } catch (error: unknown) {  
            next(error);
        }
    };

     /**
     * Logout
     */
     public async logout(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        logger.info("In GET - /logout");

        try {
            await this.addToBlacklist(req, res, next);
            return res.clearCookie('access_token').end();
        } catch (error: unknown) {
            next(error)
        }
    };
        
};