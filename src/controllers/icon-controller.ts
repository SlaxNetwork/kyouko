import { Authorized, Get, JsonController } from "routing-controllers";
import { Service } from "typedi";
import { IconService } from "../services/memory/icon-service";

@JsonController("/icons")
@Authorized()
@Service()
class IconController {
    constructor(private iconService: IconService) {}

    @Get()
    getIcons() {
        return this.iconService.getAll();
    }
}

export { IconController };
