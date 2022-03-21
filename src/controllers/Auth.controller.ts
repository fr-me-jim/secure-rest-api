import { VerifiedCallback } from "passport-jwt";
import { NextFunction, Request, Response } from 'express';

// User model
import User from '../models/User.model';

class AuthController {
    constructor() {};

    /**
     * CheckPermissions
     */
    public static checkAdminPermissions = (req: Request, res: Response, next: NextFunction): Response | void => {
        if (!req.user) return res.sendStatus(401);

        if (!(req.user! as User).privileges) return res.sendStatus(403);

        return next();
    };

    /**
     * GetUserByJWT
     */
    public static getUserByJWT = async (token: { id: string; }, done: VerifiedCallback): Promise<void> => {
        try {
            const user = await User.findOne({ 
                where: { id: token.id },
                attributes: { exclude: ['password'] },
                raw: true
            });

            if (!user) {
                return done(null, false);
            }

            return done(null, user);
        } catch (error) {
            return done(error, null);
        }
    };

    /**
     * CheckOrCreateUserLocal
     */
    public static checkOrCreateUserLocal = async (email: string, password: string, done: VerifiedCallback): Promise<void> => {
        try {
            const user = await User.findOne({ where: { email }, raw: true });
            if (!user) {
                return done(401, false, { message: 'User not found' });
            }

            const isValid: boolean = await User.isValidPassword(password, user.password);
            if (!isValid) {
                return done(401, false, { message: 'Wrong credentials' });
            }

            return done(null, user, { message: 'Login success' });
        } catch (error) {
            return done(error);  
        }
    }
        
};
    

export default AuthController;