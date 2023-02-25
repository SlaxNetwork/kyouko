import { ExpressErrorMiddlewareInterface, ExpressMiddlewareInterface, Middleware } from "routing-controllers";
import { Service } from "typedi";
import { isHttpError } from "../utils/error-utils";

@Middleware({ type: "after" })
@Service()
class QueryErrorLogger implements ExpressErrorMiddlewareInterface {
    error(error: any, request: any, response: any, next: (err?: any) => any): void {
        if (!isHttpError(error) || !error.message.startsWith("Invalid queries,")) {
            return next(error);
        }

        // it works...
        console.debug((error as any).errors);

        next(error);
    }
}

export { QueryErrorLogger };
