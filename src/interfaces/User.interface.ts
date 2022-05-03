import { Optional } from 'sequelize'
import User from '../models/User.model';

export interface IUserRepository {
  getAllUsers(): Promise<User[]>;
  getUserById(id: string): Promise<User | null>;
  getUsersByAttributes(userAttributes: UserAttributes): Promise<User[]>;
  createNewUser(newUser: UserCreate): Promise<User | null>;
  updateUser(id:string, newUserData: UserEdit): Promise<User | null>;
  updateUserPassword(id:string, newUserPassword: string): Promise<User | null>;
  deleteUser( id:string ): Promise<number | null>;
};

export type UserAttributes = {
  id: string;
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
  firstName?: string,
  secondName?: string,
  privileges?: number
};

export type UserSearchId = { id: number };
export type UserSearchEmail = { email: string };

export type UserSearchInfo = UserSearchId | UserSearchEmail;