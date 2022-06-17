import { Optional } from "sequelize/types";

export interface IOrderAttributes {
    id: string;
    date: Date;
    status: string;
    client_id: string;
    
    createdAt?: Date;
    updatedAt?: Date;
};

export interface IOrderInput extends Optional<IOrderAttributes, 'id'> {};
export interface IOrderOuput extends Required<IOrderAttributes> {};