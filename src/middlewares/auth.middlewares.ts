import { NextFunction, Request, Response } from "express";

// models
import User from "../models/User.model";
import Token from "../models/Token.model";

// check if token is blacklisted - middleware 
export const isTokenBlacklisted = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try { 
    if (!req.headers.authorization || !req.user) return res.sendStatus(401);
    
    const token: string | undefined = req.headers.authorization?.split(' ')[1];
    const blacklisted = await Token.findOne({ where: { token }, raw: true });
    if (blacklisted) return res.sendStatus(401);
    
    return next();
  } catch (error: any) {
    res.sendStatus(500);
    throw error;
  }
};

// check if token is blacklisted - middleware 
export const isAdminUser = (req: Request, res: Response, next: NextFunction): Response | void => {
  if (!(req.user as User).privileges) return res.sendStatus(403);
    
  return next();
};

export const isSuperAdminUser = (req: Request, res: Response, next: NextFunction): Response | void => {
  if ((req.user as User).privileges !== 2) return res.sendStatus(403);
    
  return next();
};
  