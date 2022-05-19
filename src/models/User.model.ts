import argon2 from "argon2";
import { Model, DataTypes } from "sequelize";
import { 
    // NonAttribute, 
    InferAttributes, 
    CreationOptional, 
    InferCreationAttributes
} from "sequelize";

// database connection
import connection from "../models/index";

// interfaces
import {
    // IUserInput,
    IUserInstance,
    // IUserAttributes
} from '../interfaces/User.interface';

/**
 * @module  User
 * @description contain the details of Attribute
 */
class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> 
implements IUserInstance 
{
    declare id: CreationOptional<string>;
    declare email: string;
    declare password: string;
    declare firstName: string;
    declare secondName: string;
    declare privileges: CreationOptional<number>;

    declare readonly createdAt?: CreationOptional<Date>;
    declare readonly updatedAt?: CreationOptional<Date>;
    declare readonly deletedAt?: CreationOptional<Date>;
    
    /**
     * @method isValidPassword
     * @desc Instance Method to check passwords
     **/
    async isValidPassword(userPassword: string, inputPassword: string): Promise<boolean> {  
        // console.log('[This Password]: ', this.password);
        try {
            return await argon2.verify(userPassword, inputPassword);
        } catch (error: any) {
            throw new Error(error);
        }
    };
};

User.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: { isEmail: true }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    secondName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    privileges: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, { 
    sequelize: connection, 
    modelName: 'User', 
    tableName: 'users', 
    timestamps: true, createdAt: true, updatedAt: true, deletedAt: true
});
User.prototype.isValidPassword = async (userPassword: string, inputPassword: string): Promise<boolean> => {
    // console.log('[This Password]: ', this.password);
    try {
        return await argon2.verify(userPassword, inputPassword);
    } catch (error: any) {
        throw new Error(error);
    }
}
User.beforeSave( async (user: User) => {
    if (!user.password) return;
    try {
        const hashedPassword = await argon2.hash(user.password);
        user.password = hashedPassword;
    } catch (error: unknown) {
        throw error;
    }
});

export default User;
