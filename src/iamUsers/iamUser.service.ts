import { Prisma } from "@prisma/client";
import { GenericError } from "../error";
import { prisma } from "../prisma";

export const findIamUserById = async (id: string) => {
    try {
        const project = await prisma.iamUser.findUniqueOrThrow({
            include: {
                project: true
            },
            where: {
                id,
            },
        });

        return project;
    } catch (e) {
        throw new GenericError('IamUserNotFound', `Project with id ${id} doesn't exist`);
    }
}

export const findIamUserByProject = async (projectId: string, address?: string) => {
    try {

        if(address) {
            const project = await prisma.iamUser.findFirstOrThrow({
                include: {
                    project: true
                },
                where: {
                    projectId,
                    address
                },
            });
    
            return project;
        }

        const projects = await prisma.iamUser.findMany({
            include: {
                project: true
            },
            where: {
                projectId
            }
        })

        return projects
    } catch (e) {
        throw new GenericError('IamUserNotFound', `Project with id ${projectId} doesn't exist`);
    }
};

export const createIamUser = async (data: Prisma.IamUserCreateInput) => {
    try {
        const user = await prisma.iamUser.create({
            include: {
                project: true
            },
            data
        })

        return user
    } catch (e) {
        console.log(e)
        throw new GenericError('IamUserNotCreated', `IamUser cannot be created - ${JSON.stringify(e)}`);
    }
}


export const updateIamUser = async (data: Prisma.IamUserUpdateInput) => {
    if (!data.id) throw new GenericError(`IdIsMandotary`, `Mention id in data`);

    try {
        const user = await prisma.iamUser.update({
            include: {
                project: true
            },
            where: {
                id: data.id as string
            },
            data,
        });

        return user;
    } catch (e) {
        throw new GenericError('IamUserNotCreated', `IamUser cannot be created - ${JSON.stringify(e)}`);
    }
};