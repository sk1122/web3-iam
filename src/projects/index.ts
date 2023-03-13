import { Router } from "express";
import { isAuthenticated } from "../middlewares";
import { ProjectController } from "./project.controller";

export const projectRouter = Router()
const projectController = new ProjectController()

projectRouter.get("/", isAuthenticated, (req, res) => projectController.findProject(req, res))
projectRouter.post("/", isAuthenticated, (req, res) => projectController.createProject(req, res))
projectRouter.patch("/", isAuthenticated, (req, res) => projectController.updateProject(req, res))