import { Request, Response } from "express";
import { bookingService } from "./booking.service";
import { JwtPayload } from "jsonwebtoken";


const addBooking = async (req: Request, res: Response) => {
  try {
    const result = await bookingService.addBooking(req.body);
    res.status(201).json({
      "success": true,
      "message": "Booking created successfully",
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
const allBooking = async (req: Request, res: Response) => {
  try {
    const userInfo = req.user;
    const result = await bookingService.allBooking(userInfo as JwtPayload);
    res.status(201).json({
      "success": true,
      "message": "Bookings retrieved successfully",
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
const updateBooking = async (req: Request, res: Response) => {
  try {
    const bookingId = Number(req.params.bookingId);
    const user = req.user as { id: number; role: string };
    const result = await bookingService.updateBooking(bookingId, user);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      "success": false,
      "message": error.message,
      "errors": error.error
    })
  }
}

export const bookingController = {
  addBooking,allBooking,updateBooking
}

