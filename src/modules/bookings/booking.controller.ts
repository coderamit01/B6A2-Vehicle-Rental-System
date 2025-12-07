import { Request, Response } from "express";
import { bookingService } from "./booking.service";


const addBooking = async (req: Request, res: Response) => {
  try {
    const result = await bookingService.addBooking(req.body);
    res.status(201).json({
      "success": true,
      "message": "Booking created successfully",
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

export const bookingController = {
  addBooking,
}

