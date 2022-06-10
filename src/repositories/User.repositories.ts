import argon2 from "argon2";

// models
import User from '../models/User.model';

// interfaces
import { 
    UserType,
    UserEdit,
    UserCreate,
    IUserRepository,
} from '../interfaces/User.interface';

class UserRepositories implements IUserRepository {
    private readonly _model = User;

    constructor() {};

    public readonly getAllUsers = async (exclusions: string[] = ["password"]): Promise<User []> => {
        try {
            const users = await this._model.findAll({ 
                attributes: { exclude: exclusions },
                raw: true 
            });

            return users;
        } catch (error) {
            throw error;
        }
    };

    public readonly getUserById = async (id: string, exclusions: string[] = ["password"]): Promise<User | null> => {
        if (!id) throw new Error("Required ID must be a non-empty string.");
        
        try {
            const user = await this._model.findOne({ 
                where: { id },
                attributes: { exclude: exclusions }, 
                raw: true 
            });

            return user;
        } catch (error) {
            throw error;
        }
    };

    public readonly getUserByEmail = async (email: string, exclusions: string[] = ["password"]): Promise<User | null> => {
        if (!email) throw new Error("Required Email must be a non-empty string.");

        
        try {
            const user = await this._model.findOne({ 
                where: { email },
                attributes: { exclude: exclusions }, 
                raw: true 
            });

            return user;
        } catch (error) {
            throw error;
        }
    };

    public readonly getUsersByAttributes = async (userAttributes: UserType, exclusions: string[] = ["password"]): Promise<User []> => {
        if (!userAttributes) throw new Error("Required Object with attributes to search.");
        
        try {
            const users = await this._model.findAll({ 
                where: { ...userAttributes }, 
                attributes: { exclude: exclusions },
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
            const user = await this._model.create({ ...newUser }, { 
                returning: true,
                raw: true
            });
            
            return user;
        } catch (error) {
            throw error;
        }
    };

    public readonly updateUser = async (id: string, newUserData: UserEdit): Promise<User | null> => {
        if (!id || !newUserData) throw new Error("Wrong number of parameters.");
        
        try {
            const [affectedRows, [ result ]] = await this._model.update({ ...newUserData }, 
            { 
                where: { id },
                returning: true,
            });
            if (!affectedRows) return null;

            return result;
        } catch (error) {
            throw error;
        }
    };

    public readonly updateUserPassword = async (id: string, newUserPassword: string): Promise<User | null> => {
        if (!newUserPassword || !id) throw new Error("Wrong number of parameters.");
        
        try {
            const hashedPassword = await argon2.hash(newUserPassword);
            const [affectedRows, [ user ]] = await this._model.update(
            { password: hashedPassword }, 
            { 
                where: { id },
                returning: true
            });
            if (!affectedRows) return null;

            return user;
        } catch (error) {
            throw error;
        }
    };

    public readonly deleteUser = async (id: string): Promise<number | null> => {
        if (!id) throw new Error("Required ID must be a non-empty string.");
        
        try {
            return await this._model.destroy({ where: { id } });
        } catch (error) {
            throw error;
        }
    };
};

export default UserRepositories;