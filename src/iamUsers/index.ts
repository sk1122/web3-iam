import { Router } from "express";
import { IamUserController } from "./iamUser.controller";

export const iamRouter = Router()
const iamController = new IamUserController()

iamRouter.get("/", (req, res) => iamController.findIamUser(req, res))
iamRouter.post("/", (req, res) => iamController.createIamUser(req, res))
iamRouter.patch('/', (req, res) => iamController.updateIamUser(req, res));