import { Authorized, Body, BodyParam, Delete, Get, JsonController, Post } from "routing-controllers";
import { ServerService, ServerType } from "../services/memory/server-service";
import { IsNumber, IsString } from "class-validator";
import { Service } from "typedi";

export class ServerBody {
    @IsString()
    ip!: string;

    @IsNumber()
    port!: number;

    @IsString()
    type!: ServerType;
}

@JsonController("/servers")
@Authorized()
@Service()
export class ServerController {
    constructor(private serverService: ServerService) {}

    @Get()
    getServers() {
        return this.serverService.getAll();
    }

    @Post()
    addServer(@Body() server: ServerBody) {
        return this.serverService.create(server);
    }

    @Delete()
    removeServer(@BodyParam("ip") ip: string, @BodyParam("port") port: number) {
        return this.serverService.remove(ip, port);
    }
}
