import sqlize from "sequelize";
import connection from "../models/index";
import {
    IOrderItemInput,
    IOrderItemAttributes
} from '../interfaces/OrderItem.interface';

// models
import Order from "./Order.model";
import Product from "./Product.model";

/**
 * @module  Order
 * @description contain the details of Orders
 */
const { Model, DataTypes } = sqlize;

class OrderItem extends Model<IOrderItemAttributes, IOrderItemInput> {
    declare id: string;
    declare order_id: string;
    declare product_id: string;
    declare amount: number;
    declare price: number;

    declare readonly createdAt?: Date;
    declare readonly updatedAt?: Date;
};

OrderItem.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    order_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Order,
            key: 'id'
        },
        unique: "uniqueOrderProduct"
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        }
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    product_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Product,
            key: 'id'
        },
        unique: "uniqueOrderProduct"
    }
}, { 
    sequelize: connection, 
    modelName: 'OrderItem', 
    tableName: 'order_items', 
    timestamps: true, 
    createdAt: true, 
    updatedAt: true
});


export default OrderItem;
