import { Authorized, Get, JsonController, QueryParams } from "routing-controllers";
import { httpError } from "../utils/error-utils";
import { Profile } from "@prisma/client";
import { notFoundError } from "./errors/generc.error";
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
class ProfileController {
    constructor(private profileService: ProfileService, private redisService: RedisService) {}

    @Get()
    async getProfile(@QueryParams() query: GetProfileQuery) {
        const { uuid, username } = query;

        let profile: Profile | null = null;

        if (uuid) {
            profile = await this.profileService.findByUUID(uuid);
        }

        if (username && !profile) {
            const cachedUuid = await this.redisService.getUUIDFromName(username);
            if (!cachedUuid) {
                throw httpError({
                    message: `no uuid cached for ${username}`,
                    httpCode: 404
                });
            }

            profile = await this.profileService.findByUUID(cachedUuid);
        }

        if (!profile) {
            throw notFoundError;
        }

        return profile;
    }
}

export { ProfileController };
