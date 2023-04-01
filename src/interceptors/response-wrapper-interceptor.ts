import { Action, Interceptor, InterceptorInterface } from "routing-controllers";
import { Service } from "typedi";

// Interceptor breaks @OnUndefined and @OnNull :(
@Interceptor()
@Service()
export class WrapResponseInterceptor implements InterceptorInterface {
    intercept(action: Action, result: any) {
        if (action.response.statusCode >= 200 && action.response.statusCode < 300) {
            return {
                error: false,
                data: result
            };
        }
        return {
            error: true,
            message: result.message || undefined,
            status: result.status || 500
        };
    }
}
