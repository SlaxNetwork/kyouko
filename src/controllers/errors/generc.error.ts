import { httpError } from "../../utils/error-utils";

const notFoundError = httpError({
    message: "resource not found",
    httpCode: 404
});

const alreadyExistsError = httpError({
    message: "already exists",
    httpCode: 409
});

export { notFoundError, alreadyExistsError };
