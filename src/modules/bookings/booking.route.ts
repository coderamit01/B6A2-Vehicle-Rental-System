import { Router } from "express";
import { bookingController } from "./booking.controller";

const route = Router();

route.post('/bookings', bookingController.addBooking);
// route.get('/bookings',);
// route.put('/bookings',);

export const bookingRoute = route;