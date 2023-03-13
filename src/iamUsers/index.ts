import { Router } from "express";
import { isAuthenticated } from "../middlewares";
import { IamUserController } from "./iamUser.controller";

export const iamRouter = Router()
const iamController = new IamUserController()

iamRouter.get("/", isAuthenticated, (req, res) => iamController.findIamUser(req, res))
iamRouter.post("/", isAuthenticated, (req, res) => iamController.createIamUser(req, res))
iamRouter.patch('/', isAuthenticated, (req, res) => iamController.updateIamUser(req, res));