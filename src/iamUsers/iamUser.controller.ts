import { IamUser, Project } from '@prisma/client';
import { Request, Response } from 'express';
import { GenericError, handleError } from '../error';
import { logger } from '../logger';
import { createIamUser, findIamUserById, findIamUserByProject, updateIamUser } from './iamUser.service';

export class IamUserController {
    public findIamUser = async (req: Request, res: Response) => {
        try {
            if (!req.query.id && !req.query.project && !req.query.address)
                throw new GenericError('IncompleteArgs', `please mention id or key or owner in query params`);

            let result: any;

            if(req.query.id) result = await findIamUserById(req.query.id as string)
            else if (req.query.project) result = await findIamUserByProject(req.query.project as string, req.query.address as string | undefined)

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

    public createIamUser = async (req: Request<{}, {}, IamUser & { project: string }>, res: Response) => {
        try {
            const result = await createIamUser({
                ...req.body,
                project: {
                    connect: {
                        id: req.body.project
                    }
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

    public updateIamUser = async (
        req: Request<{}, {}, IamUser & { project: string }>,
        res: Response
    ) => {
        try {
            const result = await updateIamUser({
                ...req.body,
                project: {
                    connect: {
                        id: req.body.project
                    }
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
