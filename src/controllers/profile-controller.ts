import { Authorized, Get, JsonController, QueryParams, NotFoundError } from "routing-controllers";
import { Profile } from "@prisma/client";
import { IsOptional, IsString, IsUUID } from "class-validator";
import { Service } from "typedi";
import { ProfileService } from "../services/postgres/profile-service";
import { RedisService } from "../services/redis/redis-service";

class GetProfileQuery {
    @IsUUID()
    @IsOptional()
    uuid?: string;

    @IsString()
    @IsOptional()
    username?: string;
}

@JsonController("/profiles")
@Authorized()
@Service()
export class ProfileController {
    constructor(private profileService: ProfileService, private redisService: RedisService) {}

    @Get()
    async getProfile(@QueryParams() query: GetProfileQuery) {
        const { uuid, username } = query;

        let profile: Profile | null = uuid ? await this.profileService.findByUUID(uuid) : null;

        if (username && !profile) {
            const cachedUuid = await this.redisService.getUUIDFromName(username);
            if (!cachedUuid) throw new NotFoundError(`No UUID cached for ${username}`);

            profile = await this.profileService.findByUUID(cachedUuid);
        }

        if (!profile) throw new NotFoundError("resource not found");

        return profile;
    }
}
