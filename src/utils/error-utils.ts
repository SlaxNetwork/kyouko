import { HttpError } from "routing-controllers";

/**
 * Check whether an object is a {@link HttpError}.
 * @param obj Object to check.
 * @returns whether the object is an {@link HttpError}.
 */
export function isHttpError(obj: any): obj is HttpError {
    return Object.hasOwn(obj, "httpCode") && Object.hasOwn(obj, "message");
}
