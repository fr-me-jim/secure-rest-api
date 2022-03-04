import { Optional } from 'sequelize'

export interface UserAttributes {
  id: number;
  email: string;
  password: string;
  firstName: string;
  secondName: string;
  privileges: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

export interface UserInput extends Optional<UserAttributes, 'id' | 'privileges'> {};
export interface UserOuput extends Required<UserAttributes> {};

export type UserType = UserAttributes;

export type UserLogin = {
  email: string,
  password: string
};

export type UserCreate = {
  email: string,
  password: string,
  firstName: string,
  secondName: string,
  privileges?: number
};

export type UserEdit = {
  email?: string,
  password?: string,
  firstName?: string,
  secondName?: string,
  privileges?: number
};

export type UserSearchId = { id: number };
export type UserSearchEmail = { email: string };

export type UserSearchInfo = UserSearchId | UserSearchEmail;