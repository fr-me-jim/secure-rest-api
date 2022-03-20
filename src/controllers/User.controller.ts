import jwt from "jsonwebtoken";
import { Request, Response } from 'express';

// User model
import User from '../models/User.model';

// User interfaces
import {
    UserEdit,
    UserLogin,
    UserCreate,
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
     * RegisterUser
     */
     public static registerUser = async (req: Request, res: Response): Promise<Response> => {
        try {
            const user: UserCreate | undefined = req.body;
            if(!user) return res.sendStatus(400);

            const result = await User.create(
                { ...user },
                { returning: true, raw: true }    
            );
            if(!result) return res.sendStatus(500);

            const token = jwt.sign({ id: result.id }, process.env.JWT_SECRET!, {
                expiresIn: 60 * 60 * 24 // 24 hours
            });
        

            return res.send({ token }).status(201);
        } catch (error: any) {
            res.sendStatus(500);
            throw new Error(error);
        }  
    };

    /**
     * GetUserProfileInfo
     */
     public static getUserProfileInfo = async (req: Request, res: Response): Promise<Response> => {
        if (!req.user) return res.sendStatus(401);
        try {
            return res.send({ ...req.user! }).status(200);
        } catch (error: any) {  
            res.sendStatus(500);
            throw new Error(error);
        }
    };

    /**
     * EditProfileUser
     */
     public static editProfileUser = async (req: Request, res: Response): Promise<Response> => {
        if (!req.user) return res.sendStatus(401);
        try {
            const newUser: UserEdit = req.body;
            if(!newUser) return res.sendStatus(400);

            const [rows, result] = await User.update({ 
                ...newUser 
            }, { where: { id: (req.user! as User).id }, returning: true });
            console.log('[ID]', (req.user! as User).id)
            console.log('[Update result]', result)
            console.log('[Rows]', rows)
            if(!rows) return res.sendStatus(404);

            return res.send({ ...result[0] }).status(200);
        } catch (error: any) {
            res.sendStatus(500);
            throw new Error(error);
        }  
    };
    

};

export default UserController;