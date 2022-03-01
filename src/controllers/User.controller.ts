import { NextFunction, Request, Response } from 'express';
import User from '../models/User.model';

import {
    UserLogin,
    UserCreate,
    // UserAttributes,
} from '../interfaces/User.interface';

class UserController {
    // public id!: number;
    // public email!: string;
    // public password!: string;
    // public firstName!: string;
    // public secondName!: string;
    // public privileges!: number;

    // public readonly createdAt?: Date;
    // public readonly updatedAt?: Date;
    // public readonly deletedAt?: Date;

    constructor() {
        
    };

    /**
     * Login
     */
    public static login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const user: UserLogin = req.body;
        try {
            const result = await User.findOne({ where: {
                email: user.email, 
                password: user.password
            }});
            if(!result) res.sendStatus(404);

            res.send({ user: result }).status(200);
        } catch (error: any) {  
            throw new Error(error);
        }
    };

    /**
     * Logout
     */
    public static logout = (): void => {

    };

    /**
     * CreateUser
     */
    public static createUser = (user: UserCreate) => {
        
    }

    /**
     * GetUserInfo
     */
    public static getUserInfo = () => {

    };

};

export default UserController;