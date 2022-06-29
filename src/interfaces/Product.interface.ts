import { Optional } from 'sequelize';

// model
import Product from '../models/Product.model';

export interface IProductRepository {
  getAllProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getProductsByAttributes(productAttributes: ProductSearch): Promise<Product[]>;
  createProduct(newProduct: ProductCreate): Promise<Product | null>;
  updateProduct(id: string, newProductData: ProductEdit): Promise<Product | null>;
  deleteProduct(id: string): Promise<number | null>
};

export interface IProductAttributes {
  id: string;
  name: string;
  image: string;
  price: number;
  stock: number;
  premium: boolean;
  category: string;
  description: string;
  
  createdAt?: Date;
  updatedAt?: Date;
};
  
export interface IProductInput extends Optional<IProductAttributes, 'id' | 'premium'> {};
export interface IProductOuput extends Required<IProductAttributes> {};

export type ProductType = IProductAttributes;

export type ProductCreate = {
  name: string;
  image: string;
  price: number;
  stock: number;
  category: string;
  premium?: boolean;
  description: string;
};

export type ProductEdit = {
  name: string;
  image: string;
  price: number;
  stock: number;
  category: string;
  premium?: boolean;
  description: string;
};

export type ProductSearch = {
  name?: string;
  price?: number;
  stock?: number;
  category?: string;
  premium?: boolean;
  description?: string;
};