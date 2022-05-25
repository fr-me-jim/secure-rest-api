import { Optional } from 'sequelize'

// models
import Token from '../models/Token.model';

export interface ITokenRepositories {
  createNewBlacklistedToken(token: string, user_id: string): Promise<Token>;
}

export type TokenModel = Token;
export type TokenAttributes = {
  id: string;
  token: string;
  user_id: string;

  createdAt?: Date;
  updatedAt?: Date;
};

export interface TokenInput extends Optional<TokenAttributes, 'id'> {};
export interface TokenOuput extends Required<TokenAttributes> {};

export type JWTAccessSignInfo = { id: string };