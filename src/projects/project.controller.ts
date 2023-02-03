import { Project } from "@prisma/client";
import { Request, Response } from "express";
import { GenericError, handleError } from "../error";
import { logger } from "../logger";
import { createProject, findProjectById, findProjectByKey, findProjectByOwner, updateProject } from "./project.service";

export class ProjectController {
    public findProject = async (req: Request, res: Response) => {
        try {
            if (!req.query.id && !req.query.key && !req.query.owner)
                throw new GenericError('IncompleteArgs', `please mention id or key or owner in query params`);

            let result: any;

            if (req.query.id) {
                result = await findProjectById(req.query.id as string);
            } else if (req.query.key) {
                result = await findProjectByKey(req.query.key as string);
            } else if (req.query.owner) {
                result = await findProjectByOwner(req.query.owner as string);
            }

            res.status(200).send({
                status: 200,
                timestamp: new Date().toISOString(),
                data: result,
            });
        } catch (e: any) {
            logger.error(e);

            const response = handleError(e);

            res.status(response.status).send(response);
        }
    };

    public createProject = async (req: Request<{}, {}, Project & { user: string }>, res: Response) => {
        try {
            const result = await createProject({
                ...req.body,
                user: {
                    connect: {
                        address: req.body.user,
                    },
                },
            });

            res.status(200).send({
                status: 200,
                timestamp: new Date().toISOString(),
                data: result,
            });
        } catch (e: any) {
            logger.error(e);

            const response = handleError(e);

            res.status(response.status).send(response);
        }
    };

    public updateProject = async (req: Request<{}, {}, Project & { iamUsers: string[] }>, res: Response) => {
        try {
            const result = await updateProject({
                ...req.body,
                iamUsers: {
                    connect: req.body.iamUsers?.map(x => ({ id: x }))
                }
            });

            res.status(200).send({
                status: 200,
                timestamp: new Date().toISOString(),
                data: result,
            });
        } catch (e: any) {
            logger.error(e);

            const response = handleError(e);

            res.status(response.status).send(response);
        }
    };
}