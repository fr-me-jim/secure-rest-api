import { Request, Response } from 'express';
import jwt, { Algorithm } from "jsonwebtoken";

// models
import User from '../models/User.model';
import Token from '../models/Token.model';

// types
import { JWTAccessSignInfo } from 'src/interfaces/Token.interface';

class TokenController {
    constructor() {}

    /**
     * CreateNewJWTToken
     */
    public static createNewJWTToken = ( info: JWTAccessSignInfo ): string => {
        // const algorithm = (process.env.JWT_ALG! as Algorithm);
        // const expiresIn = parseInt(process.env.JWT_EXPIRATION!);
        const token = jwt.sign( info, process.env.JWT_SECRET!, {
            // algorithm,
            expiresIn,
            // issuer: process.env.JWT_ISSUER!,
            // audience: process.env.JWT_AUDIENCE!
        });  

        return token;
    };

    /**
     * AddToBlacklist
     */
    public static addToBlacklist = async (req: Request, res: Response): Promise<Response> => {
        try {
            const user_id = (req.user! as User).id;
            const token: string = req.headers.authorization!.split(' ')[1];
            const result = await Token.create({ token, user_id }, { returning: true });
            
            if (!result) return res.sendStatus(500);

            return res.sendStatus(200);
        } catch (error: any) {
            res.sendStatus(500);
            throw new Error(error);
        }
    };
};

export default TokenController;
