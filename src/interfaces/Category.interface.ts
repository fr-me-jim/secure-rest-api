import { Optional } from 'sequelize';

// model
import Category from '../models/Category.model';

export interface ICategoryRepository {
    getAllCategories(): Promise<Category[]>;
    getCategoryById(id: string): Promise<Category | null>;
    getCategoryByName(name: string): Promise<Category | null>;
    getCategorysByAttributes(categoryAttributes: CategoryType): Promise<Category[]>;
    createCategory(newCategory: CategoryCreate): Promise<Category | null>;
    updateCategory(id: string, newCategoryData: CategoryEdit): Promise<Category | null>;
    deleteCategory(id: string): Promise<number | null>
};

export interface ICategoryAttributes {
    id: string;
    name: string;

    createdAt?: Date;
    updatedAt?: Date;
};

export interface ICategoryInput extends Optional<ICategoryAttributes, 'id'> {};
export interface ICategoryOuput extends Required<ICategoryAttributes> {};

export type CategoryType = ICategoryAttributes;

export type CategoryCreate = {
    name: string;
};

export type CategoryEdit = {
    name: string;
};

export type CategorySearch = {
    name?: string;
};