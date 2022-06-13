import sqlize from "sequelize";
import connection from "../models/index";
import {
    IProductInput,
    IProductAttributes
} from '../interfaces/Product.interface';

// models
import Category from "./Category.model";

/**
 * @module  Product
 * @description contain the details of Attribute
 */
const { Model, DataTypes } = sqlize;

class Product extends Model<IProductAttributes, IProductInput> {
    declare id: string;
    declare name: string;
    declare image: string;
    declare price: number;
    declare premium: boolean;
    declare category: string;
    declare description: string;
    declare category_id: string;

    declare readonly createdAt?: Date;
    declare readonly updatedAt?: Date;
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
        allowNull: false,
        references: {
            model: Category,
            key: 'name'
        }
    
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Category,
            key: 'id'
        }
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
