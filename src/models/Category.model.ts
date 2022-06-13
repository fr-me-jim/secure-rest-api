import sqlize from "sequelize";
import connection from "../models/index";
import {
    ICategoryInput,
    ICategoryAttributes
} from '../interfaces/Category.interface';

/**
 * @module  Product
 * @description contain the details of Attribute
 */
const { Model, DataTypes } = sqlize;

class Category extends Model<ICategoryAttributes, ICategoryInput> {
    declare id: string;
    declare name: string;

    declare readonly createdAt?: Date;
    declare readonly updatedAt?: Date;
};

Category.init({
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
    }
}, { 
    sequelize: connection, 
    modelName: 'Category', 
    tableName: 'categories', 
    timestamps: true, 
    createdAt: true, 
    updatedAt: true
});

export default Category;
