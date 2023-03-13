import { prisma } from "../prisma";
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken"
import { GenericError, handleError } from "../error";
import { findProjectByKey } from "../projects/project.service";
import { findUserByAddress } from "../user/user.service";

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {    
    try {
        const { authorization } = req.headers
        const secretKey = req.headers['secret-key']

        if(!authorization && !secretKey) throw new GenericError('JWTTokenNotInHeader', `jwt token not in header`)

        try {
            if(authorization) {
                const token = authorization.split(" ")[1]
                const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as jwt.JwtPayload;
                
                const user = await findUserByAddress(payload.user)
        
                res.locals.payload = payload
                res.locals.user = user
        
                next()
            } else throw ""
        } catch (e: any) {
            try {
                console.log(req.headers, "123")
                const project = await prisma.project.findFirstOrThrow({
                    include: {
                        user: true
                    },
                    where: {
                        key: secretKey as string
                    }
                })
                res.locals.user = project.user

                next()
            } catch (e: any) {
                if(e.name === 'ObjectNotFound') throw e
                else throw new GenericError(`AuthorizationFailed`, `token is invalid`)
            }
        }
    } catch (e: any) {
        const error = handleError(e)

        res.status(error.status).send(error)
    }
}