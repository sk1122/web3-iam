import { Prisma } from "@prisma/client"
import { GenericError } from "../error";
import { prisma } from "../prisma";

export const findEventById = async (id: string) => {
    try {
        const event = await prisma.event.findUniqueOrThrow({
            where: {
                id,
            },
        });

        return event;
    } catch (e) {
        throw new GenericError('EventNotFound', `Event with id ${id} doesn't exist`);
    }
}
export const findEventByProject = async (project: string) => {
    try {
        const events = await prisma.event.findMany({
            where: {
                projectId: project
            },
        });

        return events;
    } catch (e) {
        throw new GenericError('EventNotFound', `Event with id ${project} doesn't exist`);
    }
}
export const findEventByIamUser = async (iamUser: string) => {
    try {
        const events = await prisma.event.findMany({
            where: {
                iamUserId: iamUser,
            },
        });

        return events;
    } catch (e) {
        throw new GenericError('EventNotFound', `Event with id ${iamUser} doesn't exist`);
    }
}

export const createEvent = async (event: Prisma.EventCreateInput) => {
    try {
        const events = await prisma.event.create({
            data: event
        });

        return events;
    } catch (e) {
        console.log(e)
        throw new GenericError('EventNotCreated', `Not able to create project, more info - ${JSON.stringify(e)}`);
    }
}
export const updateEvent = async (event: Prisma.EventUpdateInput) => {
    if (!event.id) throw new GenericError(`IdIsMandotary`, `Mention id in data`);
    
    try {
        const events = await prisma.event.update({
            where: {
                id: event.id as string
            },
            data: event,
        });

        return events;
    } catch (e) {
        throw new GenericError('EventNotCreated', `Not able to create project, more info - ${JSON.stringify(e)}`);
    }
}