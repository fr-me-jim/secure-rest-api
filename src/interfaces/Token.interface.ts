import { Optional } from 'sequelize'

export interface TokenAttributes {
  id: string;
  token: string;
  user_id: string;

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

export interface TokenInput extends Optional<TokenAttributes, 'id'> {};
export interface TokenOuput extends Required<TokenAttributes> {};

export type JWTAccessSignInfo = { id: string };