import { HttpError } from "routing-controllers";

type Error = {
    message: string;
    httpCode: number;
};

/**
 * Check whether an object is a {@link HttpError}.
 * @param obj Object to check.
 * @returns whether the object is an {@link HttpError}.
 */
function isHttpError(obj: any): obj is HttpError {
    return Object.hasOwn(obj, "httpCode") && Object.hasOwn(obj, "message");
}

/**
 * Create a HttpError object to throw.
 * @param error Typed error.
 */
function httpError(error: Error) {
    return error;
}

export { isHttpError, httpError };
