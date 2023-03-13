import { prisma } from "../prisma";
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken"
import { GenericError, handleError } from "../error";
import { findProjectByKey } from "../projects/project.service";
import { findUserByAddress } from "../user/user.service";

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {    
    try {
        const { authorization } = req.headers

        if(!authorization) throw new GenericError('JWTTokenNotInHeader', `jwt token not in header`)

        const token = authorization.split(" ")[1]
        try {
            const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as jwt.JwtPayload;
            
            const user = await findUserByAddress(payload.user)
    
            res.locals.payload = payload
            res.locals.user = user
    
            next()
        } catch (e: any) {
            try {
                const project = await prisma.project.findFirstOrThrow({
                    include: {
                        user: true
                    },
                    where: {
                        key: req.headers['secret-key'] as string
                    }
                })
                res.locals.user = project.user

                next()
            } catch (e: any) {
                if(e.name === 'ObjectNotFound') throw e
                else throw new GenericError(`AuthorizationFailed`, `${token} is invalid`)
            }
        }
    } catch (e: any) {
        const error = handleError(e)

        res.status(error.status).send(error)
    }
}