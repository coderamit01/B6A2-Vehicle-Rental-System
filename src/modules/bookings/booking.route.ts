import { Router } from "express";
import { bookingController } from "./booking.controller";
import { authAdminOrCustomer, authAdminOrOwn, authenticate } from "../../middleware/auth.middleware";

const route = Router();

route.post('/bookings',authenticate, authAdminOrOwn, bookingController.addBooking);

route.get('/bookings',authenticate, authAdminOrCustomer, bookingController.allBooking);

route.put('/bookings/:bookingId',authenticate, authAdminOrCustomer, bookingController.updateBooking);


export const bookingRoute = route;