import { Request, Response } from 'express';

// models
import User from '../models/User.model';
import Token from '../models/Token.model';

class TokenController {
    constructor() {}

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
