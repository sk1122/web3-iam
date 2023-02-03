import { Event } from '@prisma/client';
import { Request, Response } from 'express';
import { GenericError, handleError } from '../error';
import { logger } from '../logger';
import { createEvent, findEventByIamUser, findEventById, findEventByProject, updateEvent } from './events.service';

export class EventController {
    public findEvent = async (req: Request, res: Response) => {
        try {
            if (!req.query.id && !req.query.project && !req.query.iamUser)
                throw new GenericError('IncompleteArgs', `please mention id or project or iamUser in query params`);

            let result: any;

            if (req.query.id) {
                result = await findEventById(req.query.id as string);
            } else if (req.query.project) {
                result = await findEventByProject(req.query.project as string);
            } else if (req.query.iamUser) {
                result = await findEventByIamUser(req.query.iamUser as string);
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

    public createEvent = async (req: Request<{}, {}, Event & { project: string; iamUser: string }>, res: Response) => {
        try {
            const result = await createEvent({
                ...req.body,
                data: req.body.data as any,
                project: {
                    connect: {
                        id: req.body.project,
                    },
                },
                iamUser: {
                    connect: {
                        id: req.body.iamUser,
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

    public addEventData = async (req: Request<{}, {}, Event>, res: Response) => {
        try {
            const previousData = (await findEventById(req.body.id)).data

            const result = await updateEvent({
                ...req.body,
                data: [
                    ...previousData,
                    ...req.body.data
                ]
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
