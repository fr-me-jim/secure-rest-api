import { Request, Response } from 'express';

// class
import UserController from './User.controller';

// User interfaces
import {
    IUserRepository,
    UserCreate, UserEdit
} from '../interfaces/User.interface';

class SuperAdminController extends UserController {
    constructor(respository: IUserRepository) {
        super(respository);
    }

    /**
     * GetAllUserInfo
     */
    public readonly getAllUserInfo = async (_req: Request, res: Response): Promise<Response> => {
        try {
            const result = await this.UsersRepository.getAllUsers();

            return res.send({ users: result }).status(200);
        } catch (error: any) {  
            res.sendStatus(500);
            throw new Error(error);
        }
    };

    /**
     * GetUserInfo
     */
     public readonly getUserInfo = async (req: Request, res: Response): Promise<Response> => {
        const id: string | undefined = req.params.id;
        if (!id) return res.sendStatus(404);

        try {
            const user = await this.UsersRepository.getUserById( id );
            if(!user) return res.sendStatus(404);

            return res.send( user ).status(200);
        } catch (error: any) {  
            res.sendStatus(500);
            throw new Error(error);
        }
    };


    /**
     * AddNewUser
     */
    public readonly addNewUser = async (req: Request, res: Response): Promise<Response> => {
        try {
            const user: UserCreate | undefined = req.body;
            if(!user) return res.sendStatus(400);

            const result = await this.UsersRepository.createNewUser( user );
            if(!result) return res.sendStatus(500);

            return res.send({ user: result }).status(201);
        } catch (error: any) {
            res.sendStatus(500);
            throw new Error(error);
        }  
    };

    /**
     * EditUser
     */
     public readonly editUser = async (req: Request, res: Response): Promise<Response> => {
        try {
            const id: string | undefined = req.params?.id;
            if(!id) return res.sendStatus(400);

            const newUser: UserEdit = req.body;
            if(!newUser) return res.sendStatus(400);

            const user = await this.UsersRepository.updateUser( id, newUser );
            if(!user) return res.sendStatus(404);

            return res.send({ ...user }).status(200);
        } catch (error: any) {
            res.sendStatus(500);
            throw new Error(error);
        }  
    };

    /**
     * DeleteUser
     */
     public readonly deleteUser = async (req: Request, res: Response): Promise<Response> => {
        try {
            const id: string | undefined = req.params?.id;
            if(!id) return res.sendStatus(400);

            const result = await this.UsersRepository.deleteUser( id );
            if(!result) return res.sendStatus(404);

            return res.sendStatus(204);
        } catch (error: any) {
            res.sendStatus(500);
            throw new Error(error);
        }  
    };
};

export default SuperAdminController;