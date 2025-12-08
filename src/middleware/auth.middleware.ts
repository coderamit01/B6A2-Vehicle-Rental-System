import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({
      success: true,
      message: "Invalid Token"
    })
  }
  const decoded = jwt.verify(token as string, config.secret_key as string);
  req.user = decoded as JwtPayload;
  next();
}

export const authAdmin = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Admin Access Required"
    })
  }
  const role = req?.user?.role;
  if (role === 'admin') {
    next();
  } else {
    res.status(401).json({
      success: false,
      message: "Admin Access Required"
    })
  }
}
export const authAdminOrOwn = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Admin Access Required"
    })
  }
  const id = parseInt(req.params.userId as string);
  const user = req?.user;
  const userID = parseInt(user?.id);
  if (user?.role === 'admin' || userID === id) {
    next();
  } else {
    res.status(401).json({
      success: false,
      message: "Access denied."
    })
  }
}
export const authAdminOrCustomer = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Admin Access Required"
    })
  }
  const user = req?.user;
  if (user?.role === 'admin' || user?.role === 'customer') {
    next();
  } else {
    res.status(401).json({
      success: false,
      message: "Access denied."
    })
  }
}