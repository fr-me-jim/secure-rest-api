import sqlize from "sequelize";
import connection from "../models/index";
import {
    TokenInput,
    TokenAttributes
} from '../interfaces/Token.interface';

// models
import User from "./User.model";

/**
 * @module  Token
 * @description contain the details of Attribute
 */
const { Model, DataTypes } = sqlize;

class Token extends Model<TokenAttributes, TokenInput> implements TokenAttributes {
    declare id: string;
    declare token: string;
    declare user_id: string;

    declare readonly createdAt?: Date;
    declare readonly updatedAt?: Date;
    declare readonly deletedAt?: Date;
};

Token.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    token: {
        type: DataTypes.STRING(300),
        allowNull: false,
        unique: true
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    }
}, { sequelize: connection, modelName: 'Token', tableName: 'token_blacklist', timestamps: true, createdAt: true, updatedAt: true, deletedAt: true });

export default Token;