import { KyoukoErrorHandler } from "./error-handler.middleware";
import { QueryErrorLogger } from "./query-error-logger.middleware";

// error handlers will happen in order.
export default [QueryErrorLogger, KyoukoErrorHandler];
