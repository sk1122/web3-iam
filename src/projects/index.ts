import { Router } from "express";
import { ProjectController } from "./project.controller";

export const projectRouter = Router()
const projectController = new ProjectController()

projectRouter.get("/", (req, res) => projectController.findProject(req, res))
projectRouter.post("/", (req, res) => projectController.createProject(req, res))
projectRouter.patch("/", (req, res) => projectController.updateProject(req, res))