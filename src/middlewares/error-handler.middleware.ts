import { ExpressErrorMiddlewareInterface, HttpError, Middleware } from "routing-controllers";
import { isHttpError } from "../utils/error-utils";
import { Service } from "typedi";
import { isString } from "class-validator";

@Middleware({ type: "after" })
@Service()
class KyoukoErrorHandler implements ExpressErrorMiddlewareInterface {
    error(error: any, request: any, response: any, next: (err?: any) => any): void {
        if (isHttpError(error)) {
            response.status(error.httpCode);
            response.send({
                error: true,
                status: error.httpCode || 500,
                message: error.message || undefined
            });
        } else {
            response.status(500);

            // use the error as the message if its a string.
            let message = isString(error) ? error : "Internal server error.";

            response.send({
                error: true,
                status: 500,
                message: message
            });
        }

        if (process.env.DEV) {
            console.error(error);
        }

        next();
    }
}

export { KyoukoErrorHandler };
