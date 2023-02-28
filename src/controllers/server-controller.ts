import { Authorized, Body, BodyParam, Delete, Get, JsonController, Param, Post, QueryParam } from "routing-controllers";
import { Service } from "typedi";
import { ServerService } from "../services/redis/server-service";
import { IsNumber, IsString } from "class-validator";
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
}

export { ServerController };
