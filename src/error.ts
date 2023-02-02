import { ServerError } from "./types";

export class GenericError extends Error {
  name = "";

  constructor(name: string, message: string) {
    super(message)

    this.name = name
  }
}   

export const handleError = (error: Error): ServerError => {
    console.log(error.name, error.message);
    if (
        error.name.includes('NotFound') ||
        error.name.includes('NotCreated') ||
        error.name.includes('NotUpdated') ||
        error.name.includes('IsMandatory') ||
        error.name.includes('IsNotRequired') ||
        error.name === 'WrongArgs' ||
        error.name === 'GenericError'
    ) {
        return {
            error: `${error.name} - ${error.message}`,
            timestamp: new Date().toISOString(),
            status: 400,
        };
    } else if (
        error.name === 'AuthorizationFailed' ||
        error.name === 'SecretKeyNotInHeaders' ||
        error.name === 'WrongSecretKey' ||
        error.name === 'JwtTokenNotInHeaders'
    ) {
        return {
            error: `${error.name} - ${error.message}`,
            timestamp: new Date().toISOString(),
            status: 401,
        };
    } else {
        return {
            status: 400,
            timestamp: new Date().toISOString(),
            error: `${error.name} - ${error.message}`,
        };
    }
};
