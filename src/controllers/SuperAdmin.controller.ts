import validator from "validator";
import { NextFunction, Request, Response } from 'express';

// class
import UserController from './User.controller';

// error
import TypeGuardError from '../errors/TypeGuardError.error';

// User interfaces
import {
    IUserRepository,
    UserCreate, UserEdit
} from '../interfaces/User.interface';

// utils
import logger from '../config/logger.config';
import { sanitizeObject } from '../utils/helpers';
import { 
    isUserCreate
} from "../validators/User.typeguards";

class SuperAdminController extends UserController {
    constructor(respository: IUserRepository) {
        super(respository);
    }

    /**
     * GetAllUserInfo
     */
    public readonly getAllUsersInfo = async (_req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        logger.info("In [GET] - /admin/users");
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
        logger.info("In Admin [GET] - /admin/users/:id");
        try {
            const id: string = req.params.id;
            if (!id || !validator.isUUID(id)) {
                logger.error('GET /admin/users/:id - Request ID param wrong type or missing!');
                throw new TypeGuardError("[Admin] Show User - Request ID param wrong type or missing!");
            };

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
        logger.info("In Admin [POST] - /admin/users");
        try {
            const userData: UserCreate = req.body;
            if(!userData || !isUserCreate(userData)) {
                logger.error('POST /admin/users - Request body payload wrong type!');
                throw new TypeGuardError("[Admin] Add User - Request body payload wrong type!");
            };
            sanitizeObject(userData);

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
        logger.info("In Admin [PUT] - /admin/users/:id");
        try {
            const id: string | undefined = req.params?.id;
            if(!id || !validator.isUUID(id)) {
                logger.error('PUT /admin/users/:id - Request ID param wrong type or missing!');
                throw new TypeGuardError("[Admin] Edit User - Request ID param wrong type or missing!");
            };

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
        logger.info("In Admin [DELETE] - /admin/users/:id");
        try {
            const id: string = req.params?.id;
            if(!id || !validator.isUUID(id)) {
                logger.error('DELETE /admin/users/:id - Request ID param wrong type or missing!');
                throw new TypeGuardError("[Admin] Edit User - Request ID param wrong type or missing!");
            };

            const result = await this.UsersRepository.deleteUser( id );
            if(!result) return res.sendStatus(404);

            return res.sendStatus(204);
        } catch (error: unknown) {
            next(error);
        }  
    };
};

export default SuperAdminController;