import { Action, Interceptor, InterceptorInterface } from "routing-controllers";
import { Service } from "typedi";

type KyoukoResponseBody = {
    error: boolean;
    data?: any;

    message?: string;
    status?: number;
};

// Interceptor breaks @OnUndefined and @OnNull :(
@Interceptor()
@Service()
class WrapResponseInterceptor implements InterceptorInterface {
    intercept(action: Action, result: any) {
        /**
         * Check whether a response being sent was a success or not.
         */
        const isSuccess = (code: number) => code >= 200 && code < 300;

        let body: KyoukoResponseBody;

        if (isSuccess(action.response.statusCode)) {
            body = {
                error: false,
                data: result
            };
        } else {
            body = {
                error: true,
                message: result.message || undefined,
                status: result.status || 500
            };
        }

        return body;
    }
}

export { WrapResponseInterceptor };
