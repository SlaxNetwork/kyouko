import { Request } from "express";
import { Action } from "routing-controllers";

function getBearer(req: Request): string | undefined {
    return req.headers.authorization?.split(" ")[1];
}

/**
 * Check whether a request to the API is authorized.
 * @returns Whether the request was authorized or not.
 */
export function checkRequestAuthorization(action: Action, roles: string[]): boolean {
    const req = action.request as Request;
    return getBearer(req) === process.env.PRIVATE_KEY;
}
