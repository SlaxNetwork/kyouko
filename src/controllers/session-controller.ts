import {
    Authorized,
    Body,
    Delete,
    Get,
    JsonController,
    Patch,
    Post,
    QueryParam,
    NotFoundError,
    HttpError
} from "routing-controllers";
import { IsString } from "class-validator";
import { Service } from "typedi";
import { SessionService } from "../services/memory/session-service";
import { RedisService } from "../services/redis/redis-service";

class CreateSessionBody {
    @IsString({
        message: "serverName is required."
    })
    serverName!: string;

    @IsString()
    currentUsername!: string;
}

@JsonController("/sessions")
@Authorized()
@Service()
export class SessionController {
    constructor(private sessionService: SessionService, private redisService: RedisService) {}

    @Get()
    async getSession(@QueryParam("uuid") uuid: string) {
        const session = this.sessionService.findByUUID(uuid);
        if (!session) throw new NotFoundError("resource not found");

        return session;
    }

    @Post()
    async createSession(@QueryParam("uuid") uuid: string, @Body() body: CreateSessionBody) {
        if (this.sessionService.findByUUID(uuid)) {
            throw new HttpError(409, "already exists");
        }

        this.sessionService.create(uuid, body.serverName);
        // map name -> uuid & uuid -> name.
        this.redisService.cachePlayerInformation(body.currentUsername, uuid);
    }

    @Delete()
    async deleteSession(@QueryParam("uuid") uuid: string) {
        if (!this.sessionService.remove(uuid)) throw new NotFoundError("resource not found");
    }

    @Patch("/update-server")
    async updateServer() {}
}
