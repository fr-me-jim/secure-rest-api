import { Request, Response } from 'express';

// User model
import User from '../models/User.model';

// User interfaces
import {
    UserEdit,
    // UserLogin,
    // UserCreate,
    IUserRepository
} from '../interfaces/User.interface';

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
     public readonly getUserProfileInfo = async (req: Request, res: Response): Promise<Response> => {
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
     public readonly editProfileUser = async (req: Request, res: Response): Promise<Response> => {
        try {
            const newUser: UserEdit = req.body;
            if(!newUser) return res.sendStatus(400);

            const result = await this.UsersRepository.updateUser((req.user! as User).id, newUser);
            if(!result) return res.sendStatus(404);

            const { password, ...user } = result;
            return res.send({ ...user }).status(200);
        } catch (error: any) {
            res.sendStatus(500);
            throw new Error(error);
        }  
    };

    /**
     * EditProfileUser
     */
     public readonly editPasswordUser = async (req: Request, res: Response): Promise<Response> => {
        try {
            const newPassword: string = req.body;
            if(!newPassword || newPassword.length < 8) return res.sendStatus(400);

            const result = await this.UsersRepository.updateUserPassword((req.user! as User).id, newPassword);
            if(!result) return res.sendStatus(404);

            const { password, ...user } = result;
            return res.send({ ...user }).status(200);
        } catch (error: any) {
            res.sendStatus(500);
            throw new Error(error);
        }  
    };
    

};

export default UserController;