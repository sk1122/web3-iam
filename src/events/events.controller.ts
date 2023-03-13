import { Event } from '@prisma/client';
import { Request, Response } from 'express';
import { GenericError, handleError } from '../error';
import { findIamUserById, updateIamUser } from '../iamUsers/iamUser.service';
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

            let result: any

            if (req.body.name === 'wallet_removed') {
                console.log(req.body)
                result = await updateEvent({
                    id: (req.body.data as any).id,
                    data: req.body.data as any
                });
            } else {
                result = await createEvent({
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

                if(req.body.name === 'transaction_executed') {
                    console.log(req.body)
                    // queue.add("transaction", {
                    //     hash: (req.body.data as any).hash,
                    //     iam: req.body.iamUser,
                    //     id: result.id
                    // })

                    let iam = await findIamUserById(req.body.iamUser)

                    await updateIamUser({
                        id: iam.id,
                        transactionExecuted: iam.transactionExecuted + 1,
                        transactionVolume: 0
                    })
                }
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
}
