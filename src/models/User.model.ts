import bcrypt from "bcrypt";
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
    declare id: number;
    declare email: string;
    declare password: string;
    declare firstName: string;
    declare secondName: string;
    declare privileges: number;

    declare readonly createdAt?: Date;
    declare readonly updatedAt?: Date;
    declare readonly deletedAt?: Date;
    static async isValidPassword(password: string, userPassword: string) {  
        try {
            return await bcrypt.compare(password, userPassword);
        } catch (error: any) {
            throw new Error(error);
        }
        
    };
};

User.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
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
}, { sequelize: connection, modelName: 'User', tableName: 'users', timestamps: true, createdAt: true, updatedAt: true, deletedAt: true });

User.beforeSave( async (user: User) => {
    if (!user.password) return;
    try {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;
    } catch (error: any) {
        throw new Error(error);
    }
});

export default User;
