import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken"
import { GenericError, handleError } from "../error";
import { findUserByAddress } from "../user/user.service";

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    // if(req.isAuthenticated()) next()
    // else res.status(401).send({
    //     status: 401,
    //     timestamp: new Date().toISOString(),
    //     reason: "Request unauthenticated"
    // })
    
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
            if(e.name === 'ObjectNotFound') throw e
            else throw new GenericError(`AuthorizationFailed`, `${token} is invalid`)
        }
    } catch (e: any) {
        const error = handleError(e)

        res.status(error.status).send(error)
    }
}