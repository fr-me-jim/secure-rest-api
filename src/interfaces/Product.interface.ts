import { Optional } from 'sequelize'

export type ProductAttributes = {
    id: string;
    name: string;
    image: string;
    price: number;
    premium: boolean;
    category: string;
    description: string;
    
    createdAt?: Date;
    updatedAt?: Date;
  };
  
  export interface ProductInput extends Optional<ProductAttributes, 'id'> {};
  export interface ProductOuput extends Required<ProductAttributes> {};