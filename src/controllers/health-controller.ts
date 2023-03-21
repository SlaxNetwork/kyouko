import { Authorized, Get, JsonController } from "routing-controllers";
import { Service } from "typedi";

@JsonController()
@Authorized()
@Service()
export class HealthController {
    @Get("/ping")
    ping() {
        return {
            message: "Pong!",
            time: Date.now()
        };
    }
}
