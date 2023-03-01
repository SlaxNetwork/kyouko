import { Authorized, Get, JsonController } from "routing-controllers";
import { Service } from "typedi";

@JsonController()
@Authorized()
@Service()
class HealthController {
    @Get("/ping")
    ping() {
        return {
            message: "Pong!",
            time: Date.now()
        };
    }
}

export { HealthController };
