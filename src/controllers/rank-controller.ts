import { Authorized, Get, JsonController } from "routing-controllers";
import { Service } from "typedi";
import { RankService } from "../services/postgres/rank-service";

@JsonController("/ranks")
@Authorized()
@Service()
class RankController {
    constructor(private rankService: RankService) {}

    @Get()
    getAll() {
        return this.rankService.getAll();
    }
}

export { RankController };
