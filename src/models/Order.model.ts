import sqlize from "sequelize";
import connection from "../models/index";
import {
    IOrderInput,
    IOrderAttributes
} from '../interfaces/Order.interface';

// models
import User from "./User.model";

/**
 * @module  Order
 * @description contain the details of Orders
 */
const { Model, DataTypes } = sqlize;

class Order extends Model<IOrderAttributes, IOrderInput> {
    declare id: string;
    declare date: Date;
    declare status: string;
    declare client_id: string;

    declare readonly createdAt?: Date;
    declare readonly updatedAt?: Date;
};

Order.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isDate: true
        }
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    client_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    }
}, { 
    sequelize: connection, 
    modelName: 'Order', 
    tableName: 'orders', 
    timestamps: true, 
    createdAt: true, 
    updatedAt: true
});

export default Order;
