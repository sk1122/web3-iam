import { User } from "@prisma/client";
import { Request, Response } from "express";
import { GenericError, handleError } from "../error";
import { logger } from "../logger";
import { findUserByAddress, createUser, updateUser } from "./user.service";

export class UserController {
    public findUser = async (req: Request, res: Response) => {
        try {
            if (!req.query.address)
                throw new GenericError(`AddressIsMandatory`, 'address is mandatory in query params');

            const user = await findUserByAddress(req.query.address as string);

            res.status(200).send({
                status: 200,
                data: user,
                timestamp: new Date().toISOString(),
            });
        } catch (e: any) {
            logger.error(e);

            const response = handleError(e);

            res.status(response.status).send(response);
        }
    };

    public createUser = async (req: Request, res: Response) => {
        try {
            if (req.body.projects) throw new GenericError(`ProjectsIsNotRequired`, 'projects is not required');

            const user = await createUser(req.body);

            res.status(200).send({
                status: 200,
                data: user,
                timestamp: new Date().toISOString(),
            });
        } catch (e: any) {
            console.log(e)
            logger.error(e);

            const response = handleError(e);

            res.status(response.status).send(response);
        }
    };

    public updateUser = async (req: Request<{}, {}, User & { projects: string[] }>, res: Response) => {
        try {
            const user = await updateUser({
                ...req.body,
                projects: {
                    connect: req.body.projects.map(x => ({ id: x }))
                }
            });

            res.status(200).send({
                status: 200,
                data: user,
                timestamp: new Date().toISOString(),
            });
        } catch (e: any) {
            logger.error(e);

            const response = handleError(e);

            res.status(response.status).send(response);
        }
    };
}