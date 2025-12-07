import express, { Request, Response } from 'express'
import config from './config/index.js';
import { authRoute } from './modules/auth/auth.route.js';
import { initDB } from './config/database.js';
import { userRoute } from './modules/users/user.route.js';
import { authAdmin } from './middleware/authAdmin.middleware.js';
const app = express();
const PORT = config.port || 8080;

app.use(express.json());

// Initialize Database 
initDB();

// Routes 
app.use('/api/v1/auth', authRoute);

app.use('/api/v1',userRoute)




app.get('/', (req:Request, res:Response) => {
    res.send("Woo Server is on")
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})