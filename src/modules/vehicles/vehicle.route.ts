import { Router } from "express";
import { vehicleController } from "./vehicle.controller";
import { authAdmin, authenticate } from "../../middleware/auth.middleware";

const route = Router();

route.post('/vehicles',authenticate, authAdmin, vehicleController.addVehicle);
route.get('/vehicles', vehicleController.getVehicle);
route.get('/vehicles/:vehicleId', vehicleController.getSingleVehicle);
route.put('/vehicles/:vehicleId',authenticate, authAdmin, vehicleController.updateVehicle);
route.delete('/vehicles/:vehicleId',authenticate, authAdmin, vehicleController.deleteVehicle);

export const vehicleRoute = route;