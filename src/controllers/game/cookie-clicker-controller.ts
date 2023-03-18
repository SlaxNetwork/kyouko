import { Authorized, Get, JsonController, QueryParam, NotFoundError } from "routing-controllers";
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
        if (!profile) throw new NotFoundError("resource not found");
        return profile;
    }
}

export { CookieClickerController };
