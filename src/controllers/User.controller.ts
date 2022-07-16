import { NextFunction, Request, Response } from 'express';

// User model
import User from '../models/User.model';

// error
import TypeGuardError from '../errors/TypeGuardError.error';

// User interfaces
import {
    UserEditProfile,
    // UserLogin,
    // UserCreate,
    IUserRepository
} from '../interfaces/User.interface';

// utils
import { sanitizeObject } from '../utils/helpers';
import { 
    isUserEditProfile
} from "../validators/User.typeguards";

/**
 * @class UserController
 * @desc Responsible for handling API requests for the
 * /user route.
 **/
class UserController {
    protected UsersRepository: IUserRepository;

    constructor(repository: IUserRepository) {
        // super(repository);
        this.UsersRepository = repository;
    };

    /**
     * GetUserProfileInfo
     */
     public readonly getUserProfileInfo = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            if (!req.user) res.sendStatus(404);
            return res.send({ ...req.user! }).status(200);
        } catch (error: unknown) {  
            next(error);
        }
    };

    /**
     * EditProfileUser
     */
     public readonly editProfileUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const newUser: UserEditProfile = req.body; 
            if (!newUser || !isUserEditProfile(newUser)) throw new TypeGuardError("Edit Profile - Request body payload wrong parameters!");
            sanitizeObject(newUser);
            if(!newUser) return res.sendStatus(400);

            const result = await this.UsersRepository.updateUser((req.user! as User).id, newUser);
            if(!result) return res.sendStatus(404);

            const { password, ...user } = result.get();
            return res.send({ ...user }).status(200);
        } catch (error: unknown) {
            next(error);
        }  
    };

    /**
     * EditProfileUser
     */
     public readonly editPasswordUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const newPassword: string | undefined = req.body.password; 
            if(!newPassword || newPassword.length < 8) return res.sendStatus(400);

            const result = await this.UsersRepository.updateUserPassword((req.user! as User).id, newPassword);
            if(!result) return res.sendStatus(404);

            const { password, ...user } = result.get();
            return res.send({ ...user }).status(200);
        } catch (error: unknown) {
            next(error);
        }  
    };
    

};

export default UserController;