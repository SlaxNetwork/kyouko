import { Authorized, Get, JsonController, QueryParam } from "routing-controllers";
import { notFoundError } from "../errors/generc.error";
import { Service } from "typedi";
import { CookieClickerService } from "../../services/postgres/cookie-clicker-service";

@JsonController("/cookieclicker")
@Authorized()
@Service()
class CookieClickerController {
    constructor(private cookieClickerService: CookieClickerService) {}

    @Get("/profile")
    async get(@QueryParam("uuid") uuid: string) {
        const profile = await this.cookieClickerService.findByUUID(uuid);
        if (!profile) {
            throw notFoundError;
        }

        return profile;
    }
}

export { CookieClickerController };
