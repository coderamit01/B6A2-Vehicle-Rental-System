import { Router } from "express";
import { userController } from "./user.controller";
import { authAdmin, authAdminOrOwn, authenticate } from "../../middleware/auth.middleware";

const route = Router();

route.get('/users', authenticate, authAdmin, userController.getUsers);
route.put('/users/:userId', authenticate,authAdminOrOwn, userController.updateUser);
route.delete('/users/:userId', authenticate,authAdmin, userController.deleteUser);

export const userRoute = route;