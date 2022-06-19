import { Optional } from "sequelize/types";

// models
import OrderItem from "../models/OrderItem.model";

export interface IOrderItemRepository {
    getAllOrderItems(): Promise<OrderItem[]>;
    getOrderItemById(id: string): Promise<OrderItem | null>;
    getOrderItemsByOrderId(order_id: string): Promise<OrderItem[]>;
    createOrderItem(newOrderItem: OrderItemCreate): Promise<OrderItem | null>;
    updateOrderItem(id: string, newOrderItemData: OrderItemEdit): Promise<OrderItem | null>;
    deleteOrderItem(id: string): Promise<number | null>;
};

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

export type OrderItemRequest = {
    product_id: string;
    quantity: number;
    price: number;  
};

export type OrderItemCreate = {
    order_id: string;
    product_id: string;
    quantity: number;
    price: number;  
};

export type OrderItemEdit = {
    product_id?: string;
    quantity?: number;
    price?: number; 
};

export type OrderItemSearch = {
    order_id?: string;
    product_id?: string;
    quantity?: number;
    price?: number; 
};