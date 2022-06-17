import { Optional } from "sequelize/types";

export interface IOrderItemAttributes {
    id: string;
    order_id: string;
    product_id: string;
    quantity: number;
    price: number;
    
    createdAt?: Date;
    updatedAt?: Date;
};

export interface IOrderItemInput extends Optional<IOrderItemAttributes, 'id'> {};
export interface IOrderItemOuput extends Required<IOrderItemAttributes> {};