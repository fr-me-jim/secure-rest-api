import validator from "validator";
import { NextFunction, Request, Response } from 'express';

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
    public readonly getAllUsersInfo = async (_req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const users = await this.UsersRepository.getAllUsers();

            return res.send({ users }).status(200);
        } catch (error: unknown) {  
            next(error);
        }
    };

    /**
     * GetUserInfo
     */
     public readonly getUserInfo = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        const id: string | undefined = req.params.id;
        if (!id || !validator.isUUID(id)) return res.sendStatus(400);

        try {
            const user = await this.UsersRepository.getUserById( id );
            if(!user) return res.sendStatus(404);

            return res.send( user ).status(200);
        } catch (error: unknown) {  
            next(error);
        }
    };


    /**
     * AddNewUser
     */
    public readonly addNewUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const userData: UserCreate = req.body;
            if(!userData) return res.sendStatus(400);

            const user = await this.UsersRepository.createNewUser( userData );
            if(!user) return res.sendStatus(500);

            return res.send( user ).status(201);
        } catch (error: unknown) {
            next(error);
        }  
    };

    /**
     * EditUser
     */
     public readonly editUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const id: string | undefined = req.params?.id;
            if(!id || !validator.isUUID(id)) return res.sendStatus(400);

            const newUser: UserEdit = req.body;
            if(!newUser) return res.sendStatus(400);

            const user = await this.UsersRepository.updateUser( id, newUser );
            if(!user) return res.sendStatus(404);

            return res.send({ ...user }).status(200);
        } catch (error: unknown) {
            next(error);
        }  
    };

    /**
     * DeleteUser
     */
     public readonly deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const id: string | undefined = req.params?.id;
            if(!id || !validator.isUUID(id)) return res.sendStatus(400);

            const result = await this.UsersRepository.deleteUser( id );
            if(!result) return res.sendStatus(404);

            return res.sendStatus(204);
        } catch (error: unknown) {
            next(error);
        }  
    };
};

export default SuperAdminController;