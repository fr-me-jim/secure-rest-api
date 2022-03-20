import { VerifiedCallback } from "passport-jwt";

// User model
import User from '../models/User.model';

class AuthController {
    constructor() {};

    /**
     * GetUserByJWT
     */
    public static getUserByJWT = async (token: { id: any; }, done: VerifiedCallback): Promise<void> => {
        try {
            const user = await User.findOne({ 
                where: { id: token.id },
                attributes: { exclude: ['password'] } 
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
            const user = await User.findOne({ where: { email } });
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