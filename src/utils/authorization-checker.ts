import { Request } from "express";
import { Action } from "routing-controllers";

/**
 * Check whether a request to the API is authorized.
 * @returns Whether the request was authorized or not.
 */
function checkRequestAuthorization(action: Action, roles: string[]): boolean {
    const req = action.request as Request;

    const getBearer = (req: Request): string | undefined => {
        return req.headers.authorization?.split(" ")[1];
    };

    if (getBearer(req) !== process.env.PRIVATE_KEY) {
        return false;
    }

    return true;
}

export { checkRequestAuthorization };
