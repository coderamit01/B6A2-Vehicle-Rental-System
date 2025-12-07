import { Request, Response } from "express";
import { vehicleService } from "./vehicle.service";

const addVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.addVehicle(req.body);
    res.status(201).json({
      "success": true,
      "message": "Vehicle created successfully",
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

const getVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.getVehicle();
    res.status(200).json({
      "success": true,
      "message": "Vehicles retrieved successfully",
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
const getSingleVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.getSingleVehicle(req.params.vehicleId as string);
    res.status(200).json({
      "success": true,
      "message": "Vehicles retrieved successfully",
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

const updateVehicle= async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.updateVehicle(req.body, req.params.vehicleId as string);
    res.status(200).json({
      "success": true,
      "message": "Vehicle updated successfully",
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

export const vehicleController = {
  addVehicle,getVehicle,getSingleVehicle,updateVehicle,
}