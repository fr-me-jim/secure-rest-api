import sqlize from "sequelize";
import connection from "../models/index";
import {
    ProductInput,
    ProductAttributes
} from '../interfaces/Product.interface';

/**
 * @module  Product
 * @description contain the details of Attribute
 */
const { Model, DataTypes } = sqlize;

class Product extends Model<ProductAttributes, ProductInput> implements ProductAttributes {
    declare id: string;
    declare name: string;
    declare image: string;
    declare price: number;
    declare premium: boolean;
    declare category: string;
    declare description: string;

    declare readonly createdAt?: Date;
    declare readonly updatedAt?: Date;
    declare readonly deletedAt?: Date;
};

Product.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING
    },
    price: {
        type: DataTypes.NUMBER,
        allowNull: false,
        validate: {
            isValidPrice(price: number): void {  
                if ( this.premium && price < 100) {
                    throw new Error("Price too low for a premium product!");
                }
            }
        }
    },
    premium: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, { 
    sequelize: connection, 
    modelName: 'Product', 
    tableName: 'products', 
    timestamps: true, 
    createdAt: true, 
    updatedAt: true
});

export default Product;
