import { Authorized, Body, Delete, Get, JsonController, Patch, Post, QueryParam } from "routing-controllers";
import { alreadyExistsError, notFoundError } from "./errors/generc.error";
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
class SessionController {
    constructor(private sessionService: SessionService, private redisService: RedisService) {}

    @Get()
    async getSession(@QueryParam("uuid") uuid: string) {
        const session = this.sessionService.findByUUID(uuid);
        if (!session) {
            throw notFoundError;
        }

        return session;
    }

    @Post()
    async createSession(@QueryParam("uuid") uuid: string, @Body() body: CreateSessionBody) {
        if (this.sessionService.findByUUID(uuid)) {
            throw alreadyExistsError;
        }

        this.sessionService.create(uuid, body.serverName);
        // map name -> uuid & uuid -> name.
        this.redisService.cachePlayerInformation(body.currentUsername, uuid);
    }

    @Delete()
    async deleteSession(@QueryParam("uuid") uuid: string) {
        if (!this.sessionService.remove(uuid)) {
            throw notFoundError;
        }

        return;
    }

    @Patch("/update-server")
    async updateServer() {}
}

export { SessionController };
