import argon2 from "argon2";
import sqlize from "sequelize";
import connection from "../models/index";
import {
    UserInput,
    UserAttributes
} from '../interfaces/User.interface';

/**
 * @module  User
 * @description contain the details of Attribute
 */
const { Model, DataTypes } = sqlize;

class User extends Model<UserAttributes, UserInput> implements UserAttributes {
    declare id: string;
    declare email: string;
    declare password: string;
    declare firstName: string;
    declare secondName: string;
    declare privileges: number;

    declare readonly createdAt?: Date;
    declare readonly updatedAt?: Date;
    declare readonly deletedAt?: Date;

    /**
     * @method isValidPassword
     * @desc Instance Method to check passwords
     **/
    public readonly isValidPassword = async (userPassword:string, inputPassword: string): Promise<boolean> => {  
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
        type: DataTypes.STRING
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
