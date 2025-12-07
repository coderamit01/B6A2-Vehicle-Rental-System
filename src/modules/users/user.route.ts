import { Router } from "express";
import { userController } from "./user.controller";
import { authAdmin, authAdminOrOwn, authenticate } from "../../middleware/auth.middleware";

const route = Router();

route.get('/users', authenticate, authAdmin, userController.getUsers);
route.put('/users/:userId', authenticate,authAdminOrOwn, userController.updateUser);

export const userRoute = route;