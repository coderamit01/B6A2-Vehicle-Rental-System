import express, { Request, Response } from 'express'
import config from './config/index.js';
import { authRoute } from './modules/auth/auth.route.js';
import { initDB } from './config/database.js';
import { userRoute } from './modules/users/user.route.js';
import { vehicleRoute } from './modules/vehicles/vehicle.route.js';
import { bookingRoute } from './modules/bookings/booking.route.js';
const app = express();
const PORT = config.port || 8080;

app.use(express.json());

// Initialize Database 
initDB();

// Authenticate Routes 
app.use('/api/v1/auth', authRoute);
// Users Routes 
app.use('/api/v1',userRoute);
// Vehicle Routes 
app.use('/api/v1',vehicleRoute);
// Bookings Routes 
app.use('/api/v1',bookingRoute);




app.get('/', (req:Request, res:Response) => {
    res.send("Woohoo! Server is on..")
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})