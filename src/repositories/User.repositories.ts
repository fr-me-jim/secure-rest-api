import bcrypt from "bcrypt";

// models
import User from '../models/User.model';

// interfaces
import { 
    UserEdit,
    UserCreate,
    UserAttributes,
    IUserRepository
} from '../interfaces/User.interface';

class UserRepositories implements IUserRepository {
    constructor() {};

    public readonly getAllUsers = async (): Promise<User[]> => {
        try {
            const users = await User.findAll({ 
                attributes: { exclude: ["password"] },
                raw: true 
            });
            return users;
        } catch (error) {
            throw error;
        }
    };

    public readonly getUserById = async (id: string): Promise<User | null> => {
        if (!id) throw new Error("Wrong number of parameters.");
        
        try {
            const user = await User.findOne({ 
                where: { id },
                attributes: { exclude: ["password"] }, 
                raw: true 
            });
            if (!user) return null;

            return user;
        } catch (error) {
            throw error;
        }
    };

    public readonly getUsersByAttributes = async (userAttributes: UserAttributes): Promise<User[]> => {
        if (!userAttributes) throw new Error("Wrong number of parameters.");
        
        try {
            const users = await User.findAll({ 
                where: { ...userAttributes }, 
                attributes: { exclude: ["password"] },
                raw: true 
            });
            return users;
        } catch (error) {
            throw error;
        }
    };

    public readonly createNewUser = async (newUser: UserCreate): Promise<User | null> => {
        if (!newUser) throw new Error("Wrong number of parameters.");
        
        try {
            const user = await User.create({ ...newUser }, { 
                returning: true,
                raw: true
            });
            if (!user) return null;

            return user;
        } catch (error) {
            throw error;
        }
    };

    public readonly updateUser = async (id:string, newUserData: UserEdit): Promise<User | null> => {
        if (!newUserData) throw new Error("Wrong number of parameters.");
        
        try {
            const [affectedRows, [ result ]] = await User.update({ ...newUserData }, { 
                where: { id },
                returning: true,
            });
            if (!affectedRows) return null;

            return result;
        } catch (error) {
            throw error;
        }
    };

    public readonly updateUserPassword = async (id:string, newUserPassword: string): Promise<User | null> => {
        if (!newUserPassword || !id) throw new Error("Wrong number of parameters.");
        
        try {
            const password = await bcrypt.hash(newUserPassword, 10);
            const [affectedRows, [ result ]] = await User.update({ password }, { 
                where: { id },
                returning: true
            });
            if (!affectedRows) return null;

            return result;
        } catch (error) {
            throw error;
        }
    };

    public readonly deleteUser = async ( id:string ): Promise<number | null> => {
        if (!id) throw new Error("Wrong number of parameters.");
        
        try {
            return await User.destroy({ where: { id } });
        } catch (error) {
            throw error;
        }
    };
};

export default UserRepositories;