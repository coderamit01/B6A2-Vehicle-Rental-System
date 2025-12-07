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
  if (role !== 'admin') {
    res.status(401).json({
      success: false,
      message: "Admin Access Required"
    })
  }
  next();
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
      message: "Access denied. You can only update your own profile"
    })
  }
}