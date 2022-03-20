import { NextFunction, Request, Response } from "express";

// models
import Token from "../models/Token.model";

// check if token is blacklisted - middleware 
export const isTokenBlacklisted = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try { 
      if (!req.headers.authorization) {
        return res.sendStatus(401);
      }
      const token: string | undefined = req.headers.authorization?.split(' ')[1];
      const blacklisted = await Token.findOne({ where: { token } });
      if (blacklisted) {
        res.sendStatus(401);
      }
      
      next();
    } catch (error: any) {
      res.sendStatus(500);
      throw new Error(error);
    }
  };
  