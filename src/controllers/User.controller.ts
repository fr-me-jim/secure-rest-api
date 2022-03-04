import jwt from "jsonwebtoken";
import { Request, Response } from 'express';

// User model
import User from '../models/User.model';

// User interfaces
import {
    UserEdit,
    UserLogin,
} from '../interfaces/User.interface';

class UserController {
    constructor() {};

    /**
     * Login
     */
    public static login = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { email, password }: UserLogin = req.body;
            if(!email || !password) return res.sendStatus(400);

            const result = await User.findOne({ 
                where: {
                    email, 
                    password
                }
            });
            if(!result) return res.sendStatus(404);
            
            const token = jwt.sign({ id: result.id }, process.env.JWT_SECRET!, {
                expiresIn: 60 * 60 * 24 // 24 hours
            });
        

            return res.send({ token }).status(200);
        } catch (error: any) {  
            res.sendStatus(500);
            throw new Error(error);
        }
    };

    /**
     * Logout
     */
    public static logout = (): void => {

    };

    /**
     * GetUserInfo
     */
     public static getUserInfo = async (req: Request, res: Response): Promise<Response> => {
        try {
            const id: string | undefined = req.params?.id;
            if(!id) return res.sendStatus(400);

            const result = await User.findOne({ where: { id: parseInt(id) }});
            if(!result) return res.sendStatus(404);

            return res.send({ user: result }).status(200);
        } catch (error: any) {  
            res.sendStatus(500);
            throw new Error(error);
        }
    };

    /**
     * EditUser
     */
     public static editUser = async (req: Request, res: Response): Promise<Response> => {
        try {
            const id: string | undefined = req.params?.id;
            if(!id) return res.sendStatus(400);

            const newUser: UserEdit = req.body;
            if(!newUser) return res.sendStatus(400);

            const result = await User.update({ 
                ...newUser 
            }, { where: { id: parseInt(id) }});
            if(!result) return res.sendStatus(500);

            return res.send({ user: result }).status(204);
        } catch (error: any) {
            res.sendStatus(500);
            throw new Error(error);
        }  
    };
    

};

export default UserController;