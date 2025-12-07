import { Request, Response } from "express"
import { authService } from "./auth.service"

const signUp = async (req: Request, res: Response) => {
  try {
    const result = await authService.signUp(req.body);
    res.status(201).json({
      "success": true,
      "message": "User registered successfully",
      "data": result.rows[0]
    })
  } catch (error: any) {
    res.status(500).json({
      "success": false,
      "message": error.message,
      "errors": error.error
    })
  }
}
const signIn = async (req: Request, res: Response) => {
  const {email,password} = req.body;
  try {
    const result = await authService.signIn(email,password);
    res.status(201).json({
      "success": true,
      "message": "Login successful",
      "data": result
    })
  } catch (error: any) {
    res.status(500).json({
      "success": false,
      "message": error.message,
      "errors": error.error
    })
  }
}


export const authController = {
  signUp,signIn
}