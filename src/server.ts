import express, { Request, Response } from 'express'
import config from './config/index.js';
import { authRoute } from './modules/auth/auth.route.js';
import { initDB } from './config/database.js';
const app = express();
const PORT = config.port;

app.use(express.json())

// Initialize Database 
initDB();

// Routes 
app.use('/api/v1/auth', authRoute);




app.get('/', (req:Request, res:Response) => {
    res.send("Woo Server is on")
})

app.listen(PORT, () => {
  console.log("Server is running...");
})