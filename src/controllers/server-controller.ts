import { Authorized, Body, BodyParam, Delete, Get, JsonController, Patch, Post, QueryParam } from "routing-controllers";
import { Service } from "typedi";
import { ServerService } from "../services/redis/server-service";
import { CreateServerBody } from "./requests/server-requests";

@JsonController("/servers")
@Authorized()
@Service()
class ServerController {
    constructor(private serverService: ServerService) {}

    @Post()
    createServer(@Body() body: CreateServerBody) {
        this.serverService.createServerInstance(body);
    }

    @Delete()
    removeServer(@QueryParam("instanceId") instanceId: string) {
        this.serverService.deleteServerInstance(instanceId);
    }

    @Get()
    getAll() {
        return this.serverService.getServerInstances();
    }

    @Patch("/player_count")
    updatePlayerCount(@QueryParam("instanceId") instanceId: string, @BodyParam("players") players: number) {
        this.serverService.updatePlayerCount(instanceId, players);
    }
}

export { ServerController };
