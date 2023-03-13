import { prisma } from '../prisma';
import jwt from 'jsonwebtoken';
import type { User } from '@prisma/client';
import { config } from 'dotenv';
import { GenericError } from '../error';

config();

export const generateJWT = (user: User) => {
    return jwt.sign({ user: user.address }, process.env.JWT_ACCESS_SECRET as string, {
        expiresIn: '30m',
    });
};

export const generateRefreshToken = (user: User, jti: any) => {
    return jwt.sign(
        {
            user: user.address,
            jti,
        },
        process.env.JWT_REFRESH_SECRET as string,
        {
            expiresIn: '8h',
        }
    );
};

export const generateTokens = (user: User, jti: any) => {
    const accessToken = generateJWT(user);
    const refreshToken = generateRefreshToken(user, jti);

    return {
        accessToken,
        refreshToken,
    };
};

export const addRefreshTokenToWhitelist = ({
    jti,
    refreshToken,
    userId,
}: {
    jti: any;
    refreshToken: string;
    userId: string;
}) => {
    return prisma.refreshToken.create({
        data: {
            id: jti,
            hashedToken: hashToken(refreshToken),
            userId,
        },
    });
};

export const findRefreshTokenById = (id: string) => {
    id = id.toString();

    return prisma.refreshToken.findUnique({
        where: {
            id,
        },
    });
};

export const deleteRefreshToken = (id: string) => {
    return prisma.refreshToken.update({
        where: {
            id,
        },
        data: {
            revoked: true,
        },
    });
};

export const revokeTokens = (userId: string) => {
    return prisma.refreshToken.updateMany({
        where: {
            userId,
        },
        data: {
            revoked: true,
        },
    });
};

import crypto from 'crypto';

export const hashToken = (token: crypto.BinaryLike) => {
    return crypto.createHash('sha512').update(token).digest('hex');
};
