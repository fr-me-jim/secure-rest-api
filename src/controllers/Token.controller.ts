import validator from "validator";
import jwt, { Algorithm } from "jsonwebtoken";
import { NextFunction, Request, Response } from 'express';

// models
import User from '../models/User.model';
import Token from '../models/Token.model';

// types
import { JWTAccessSignInfo } from '../interfaces/Token.interface';

class TokenController {
    constructor() {}

    /**
     * CreateNewJWTToken
     */
    public static createNewJWTToken = ( info: JWTAccessSignInfo ): string => {
        const algorithm = (process.env.JWT_ALG! as Algorithm) || undefined;
        const expiresIn = parseInt(process.env.JWT_EXPIRATION! || "0") || undefined;
        const token = jwt.sign( info, process.env.JWT_SECRET!, {
            algorithm,
            expiresIn,
            issuer: process.env.JWT_ISSUER!,
            audience: process.env.JWT_AUDIENCE!
        });  

        return token;
    };

    /**
     * AddToBlacklist
     */
    public static addToBlacklist = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const user_id = (req.user! as User).id;
            if (!user_id || !validator.isUUID(user_id)) return res.sendStatus(400);

            const token: string = req.headers.authorization!.split(' ')[1];
            const result = await Token.create({ token, user_id }, { returning: true });
            
            if (!result) return res.sendStatus(500);

            return res.sendStatus(200);
        } catch (error: unknown) {
            next(error);
        }
    };
};

export default TokenController;
