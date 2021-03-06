import { Optional } from "sequelize/types";

// models
import Order from "../models/Order.model";

// interface
import { OrderItemRequest } from "./OrderItem.interface";

export interface IOrderRepository {
    getAllOrders(): Promise<Order[]>;
    getOrderById(id: string, client_id?: string): Promise<Order | null>;
    getOrdersByClientId(client_id: string): Promise<Order[]>;
    createOrder(newOrder: OrderCreate): Promise<Order | null>;
    updateOrder(id: string, newOrderData: OrderEdit, client_id?: string): Promise<Order | null>;
    deleteOrder(id: string): Promise<number | null>;
};

export type OrderStatus = 'pending' | 'payed' | 'shipped' | 'delivered' | 'cancelled';

export interface IOrderAttributes {
    id: string;
    date: Date;
    status: OrderStatus;
    client_id: string;
    
    createdAt?: Date;
    updatedAt?: Date;
};

export interface IOrderInput extends Optional<IOrderAttributes, 'id' | 'date'> {};
export interface IOrderOuput extends Required<IOrderAttributes> {};


export type OrderCreate = {
    status: OrderStatus;
    client_id: string;  
};

export type OrderEdit = {
    date?: Date;
    status?: OrderStatus;
    client_id?: string;  
};

export type OrderEditClient = {
    date?: Date;
    status?: OrderStatus;
    orderItems?: OrderItemRequest[]
};

export type OrderSearch = {
    date?: Date;
    status?: OrderStatus;
    client_id?: string;  
};