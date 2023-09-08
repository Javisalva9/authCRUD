import * as jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { IUser } from "../interfaces/user";

const TOKEN_KEY: jwt.Secret = process.env.TOKEN_KEY || '';

export const verifyToken = (role?: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token =
      req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
      return res.status(403).send("A token is required for authentication");
    }
    try {
      const userDecoded: IUser = jwt.verify(token, TOKEN_KEY) as IUser;

      if (role && userDecoded.role !== role) {
        return res.status(403).send("You dont have the required role");
      }

      req.currentUser = userDecoded;
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).send("Expired Token");
      }
      return res.status(401).send("Invalid Token");
    }
    return next();
  };
}

