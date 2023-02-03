import { Prisma } from "@prisma/client"
import { GenericError } from "../error"
import { logger } from "../logger";
import { prisma } from "../prisma"

export const findProjectById = async (id: string) => {
    try {
        const project = await prisma.project.findUniqueOrThrow({
            where: {
                id,
            },
        });

        return project;
    } catch (e) {
        throw new GenericError('ProjectNotFound', `Project with id ${id} doesn't exist`);
    }
}
export const findProjectByKey = async (key: string) => {
    try {
        const project = await prisma.project.findFirstOrThrow({
            where: {
                key,
            },
        });

        return project;
    } catch (e) {
        throw new GenericError('ProjectNotFound', `Project with key ${key} doesn't exist`);
    }
}
export const findProjectByOwner = async (owner: string) => {
    try {
        const project = await prisma.project.findMany({
            where: {
                userId: owner
            },
        });

        return project;
    } catch (e) {
        throw new GenericError('ProjectNotFound', `Project with owner ${owner} doesn't exist`);
    }
}

export const createProject = async (data: Prisma.ProjectCreateInput) => {
    try {
        const project = await prisma.project.create({
            data,
        });

        return project;
    } catch (e) {
        throw new GenericError(`ProjectNotCreated`, `Not able to create project, more info - ${JSON.stringify(e)}`);
    }
}
export const updateProject = async (data: Prisma.ProjectUpdateInput) => {
    if (!data.id) throw new GenericError(`IdIsMandotary`, `Mention id in data`);

    try {
        const project = await prisma.project.update({
            where: {
                id: data.id as string,
            },
            data,
        });

        return project;
    } catch (e) {
        logger.error(e)
        throw new GenericError(`ProjectNotUpdated`, `Not able to update project, more info - ${JSON.stringify(e)}`);
    }
}