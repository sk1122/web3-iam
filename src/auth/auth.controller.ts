import { config } from "dotenv";
import { Request, Response } from "express";
import { createUser, findUserByAddress } from "../user/user.service";
import { generateTokens } from "./auth.services";
import { GenerateOTPRequest, VerifyOTPRequest } from "./auth.types";
import { v4 as uuidv4 } from "uuid"
import { GenericError, handleError } from "../error";
import nacl from 'tweetnacl'
import base58 from 'bs58'

config()

export class AuthController {
    public async verifySig(req: Request<{}, {}, GenerateOTPRequest>, res: Response) {
        try {
            const { signature, address, name } = req.body

            if(nacl.sign.detached.verify(Buffer.from('wiam did this'), base58.decode(signature), base58.decode(address))) {
                let user: any
                
                try {
                    user = await findUserByAddress(address)
                } catch (e) {
                    user = await createUser({
                        address,
                        name,
                    })
                }
                
                const jti = uuidv4()
                const tokens = generateTokens(user, jti)
                
                res.status(200).send({
                    status: 200,
                    timestamp: new Date().toISOString(),
                    data: {
                        ...tokens,
                    }
                })
            } else {
                throw new GenericError(`SignatureInvalid`, `signature is invalid`)
            }
        } catch (e: any) {
            console.log(e);
            const error = handleError(e);

            res.status(error.status).send(error);
        }
    }
}