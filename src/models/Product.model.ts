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
    declare stock: number;
    declare premium: 0 | 1;
    declare category: string;
    declare description: string;

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
        validate: {
            is: /[a-zA-Z0-9 &_\-\.\,]/g
        }
    },
    image: {
        type: DataTypes.STRING,
        validate: {
            isUrl: true
        }
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isNumeric: true
        }
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isNumeric: true
        }
    },
    premium: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: { max: 1 }
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: Category,
            key: 'name'
        },
        validate: {
            isAlpha: true
        }
    
    },
    description: {
        type: DataTypes.TEXT,
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
