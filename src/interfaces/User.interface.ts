import { Optional } from 'sequelize';

// model
import User from '../models/User.model';

export interface IUserRepository {
  getAllUsers(exclusions?: string[]): Promise<User[]>;
  getUserById(id: string, exclusions?: string[]): Promise<User | null>;
  getUsersByAttributes(userAttributes: UserType, exclusions?: string[]): Promise<User[]>;
  createNewUser(newUser: UserCreate): Promise<User | null>;
  updateUser(id:string, newUserData: UserEdit): Promise<User | null>;
  updateUserPassword(id:string, newUserPassword: string): Promise<User | null>;
  deleteUser( id:string ): Promise<number | null>;
};

export interface IUserAttributes {
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

export interface IUserInstance extends IUserAttributes {
  isValidPassword(password: string): Promise<boolean>;
};
export interface IUserInput extends Optional<IUserAttributes, 'id' | 'privileges'> {};
export interface IUserOuput extends Required<IUserAttributes> {};

export type UserType = IUserAttributes;

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