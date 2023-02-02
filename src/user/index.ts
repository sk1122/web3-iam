import { Router } from "express";
import { UserController } from "./user.controller";

export const userRouter = Router()
const userController = new UserController()

userRouter.get("/", (req, res) => userController.findUser(req, res))
userRouter.post("/", (req, res) => userController.createUser(req, res))
userRouter.patch('/', (req, res) => userController.updateUser(req, res));