import { Optional } from "sequelize/types";

// models
import Order from "../models/Order.model";

export interface IOrderRepository {
    getAllOrders(): Promise<Order[]>;
    getOrderById(id: string): Promise<Order | null>;
    getOrdersByClientId(client_id: string): Promise<Order[]>;
    createOrder(newOrder: OrderCreate): Promise<Order | null>;
    updateOrder(id: string, newOrderData: OrderEdit): Promise<Order | null>;
    deleteOrder(id: string): Promise<number | null>;
};

export interface IOrderAttributes {
    id: string;
    date: Date;
    status: string;
    client_id: string;
    
    createdAt?: Date;
    updatedAt?: Date;
};

export interface IOrderInput extends Optional<IOrderAttributes, 'id' | 'date'> {};
export interface IOrderOuput extends Required<IOrderAttributes> {};

export type OrderCreate = {
    status: string;
    client_id: string;  
};

export type OrderEdit = {
    status?: string;
    client_id?: string;  
};

export type OrderSearch = {
    date?: Date;
    status?: string;
    client_id?: string;  
};