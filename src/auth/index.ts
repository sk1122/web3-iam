import { Router } from "express";
import { AuthController } from "./auth.controller";

export const authRouter = Router()
const authController = new AuthController()

// authRouter.post("/login", passport.authenticate("magic"), (req, res) => authController.login(req, res))
authRouter.post("/login", (req, res) => authController.verifySig(req, res))
