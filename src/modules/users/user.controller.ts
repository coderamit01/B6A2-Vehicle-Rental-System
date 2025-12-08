import { Request, Response } from "express";
import { userService } from "./user.service";

const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.getUsers();
    res.status(200).json({
      "success": true,
      "message": "Users retrieved successfully",
      "data": result.rows
    })
  } catch (error: any) {
    res.status(500).json({
      "success": false,
      "message": error.message,
      "errors": error.error
    })
  }
}

const updateUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.updateUser(req.body, req.params.userId as string);
    res.status(200).json({
      "success": true,
      "message": "User updated successfully",
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
const deleteUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.deleteUser(req.params.userId as string);
    res.status(200).json({
      "success": true,
      "message": "User deleted successfully"
    })
  } catch (error: any) {
    res.status(500).json({
      "success": false,
      "message": error.message,
      "errors": error.error
    })
  }
}

export const userController = {
  getUsers, updateUser,deleteUser
}