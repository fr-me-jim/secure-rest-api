import { Request, Response } from 'express';
import UserController from './User.controller';

// User model
import User from '../models/User.model';

// User interfaces
import {
    UserCreate,
} from '../interfaces/User.interface';

class AdminController extends UserController {
    constructor() {
        super();
    }

    /**
     * GetAllUserInfo
     */
    public static getAllUserInfo = async (req: Request, res: Response): Promise<Response> => {
        try {
            const result = await User.findAll();

            return res.send({ users: result }).status(200);
        } catch (error: any) {  
            res.sendStatus(500);
            throw new Error(error);
        }
    };

    /**
     * CreateUser
     */
    public static createUser = async (req: Request, res: Response): Promise<Response> => {
        try {
            const user: UserCreate | undefined = req.body;
            if(!user) return res.sendStatus(400);

            const result = await User.create(
                { ...user },
                { returning: true }    
            );
            if(!result) return res.sendStatus(500);

            return res.send({ user: result }).status(201);
        } catch (error: any) {
            res.sendStatus(500);
            throw new Error(error);
        }  
    };

    /**
     * DeleteUser
     */
     public static deleteUser = async (req: Request, res: Response): Promise<Response> => {
        try {
            const id: string | undefined = req.params?.id;
            if(!id) return res.sendStatus(400);

            const result = await User.destroy({ where: { id: parseInt(id) } });
            if(!result) return res.sendStatus(404);

            return res.sendStatus(204);
        } catch (error: any) {
            res.sendStatus(500);
            throw new Error(error);
        }  
    };
};

export default AdminController;