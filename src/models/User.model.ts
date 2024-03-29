import argon2 from "argon2";
import { Model, DataTypes } from "sequelize";

// database connection
import connection from "../models/index";

// interfaces
import {
    IUserInput,
    IUserInstance,
    IUserAttributes
} from '../interfaces/User.interface';

/**
 * @module  User
 * @description contain the details of Attribute
 */
class User extends Model<IUserAttributes, IUserInput> implements IUserInstance {
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
    async isValidPassword(inputPassword: string): Promise<boolean> {  
        try {
            return await argon2.verify(this.password, inputPassword);
        } catch (error: unknown) {
            throw error;
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
        defaultValue: 0,
        validate: { max: 2 }
    }
}, { 
    sequelize: connection, 
    modelName: 'User', 
    tableName: 'users', 
    timestamps: true, 
    createdAt: true, 
    updatedAt: true
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

User.afterSync( async () =>{
    try {
        await User.findOrCreate({  
            where: { email: "admin@gmail.com" },
            defaults: {
                email: "admin@gmail.com",
                password: "EP65rqpqbuz>:3)oV#XEAr^:|>=tx/nO",
                firstName: "admin",
                secondName: "admin",
                privileges: 2
            }
        });
    } catch (error: unknown) {
        throw error;
    }
})

export default User;
