import { Prisma } from '@prisma/client';
import { GenericError } from '../error';
import { logger } from '../logger';
import { prisma } from '../prisma';

export const findUserByAddress = async (address: string) => {
    try {
        const user = await prisma.user.findUniqueOrThrow({
            where: {
                address,
            },
        });

        return user;
    } catch (e) {
        throw new GenericError('UserNotFound', `User with address ${address} doesn't exist`);
    }
};

export const createUser = async (data: Prisma.UserCreateInput) => {
    try {
        const user = await prisma.user.create({
            data,
        });

        return user;
    } catch (e) {
        throw new GenericError(`UserNotCreated`, `Not able to create user, more info - ${JSON.stringify(e)}`);
    }
};

export const updateUser = async (data: Prisma.UserUpdateInput) => {
	if(!data.address) throw new GenericError(`AddressIsMandotary`, `Mention address in data`)
    
	try {
        const user = await prisma.user.update({
            where: {
                address: data.address as string,
            },
            data,
        });

        return user;
    } catch (e) {
        throw new GenericError(`UserNotUpdated`, `Not able to update user, more info - ${JSON.stringify(e)}`);
    }
};
