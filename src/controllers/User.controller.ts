import { Request, Response } from 'express';

// User model
import User from '../models/User.model';

// User interfaces
import {
    UserEdit,
    // UserLogin,
    UserCreate,
} from '../interfaces/User.interface';

// controllers
import TokenController from '../controllers/Token.controller';

class UserController {
    constructor() {};

    /**
     * Login
     */
    public static login = (req: Request, res: Response): Response => {
        try {
            if (!req.user) return res.sendStatus(404);

            const token = TokenController.createNewJWTToken({ id: (req.user! as User).id });

            return res.send({ token }).status(200);
        } catch (error: unknown) {  
            res.sendStatus(500);
            throw error;
        }
    };

    /**
     * Logout
     */
    public static logout = async (req: Request, res: Response) => await TokenController.addToBlacklist(req, res);

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
            
            const token = TokenController.createNewJWTToken({ id: result!.id });

            return res.send({ token }).status(201);
        } catch (error: unknown) {
            res.sendStatus(500);
            throw error;
        }  
    };

    /**
     * GetUserProfileInfo
     */
     public static getUserProfileInfo = async (req: Request, res: Response): Promise<Response> => {
        try {
            if (!req.user) res.sendStatus(404);
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
        try {
            const newUser: UserEdit = req.body;
            if(!newUser) return res.sendStatus(400);

            const [rows, result] = await User.update({ ...newUser }, {  
                where: { id: (req.user! as User).id }, 
                returning: true
            });
            if(!rows) return res.sendStatus(404);

            const { password, ...user } = result[0].get();
            return res.send({ ...user }).status(200);
        } catch (error: any) {
            res.sendStatus(500);
            throw new Error(error);
        }  
    };
    

};

export default UserController;