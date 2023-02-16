import { isUUID } from "class-validator";
import { httpError } from "../../utils/error-utils";
import { Service } from "typedi";
import redis from "../../database/redis-client";

@Service()
class RedisService {
    async cachePlayerInformation(name: string, uuid: string) {
        if (!isUUID(uuid)) {
            throw httpError({
                message: `${uuid} is not a valid uuid.`,
                httpCode: 422
            });
        }

        const previousName = await redis.get(`player:uuid:${uuid}:username`);

        const namesMatch = previousName === name;

        if (!namesMatch) {
            await redis.set(`player:username:${name}:uuid`, uuid);
            await redis.set(`player:uuid:${uuid}:username`, name);
        }

        // if a previous name is found and names don't match wipe previous
        if (previousName && !namesMatch) {
            await redis.del(`player:username:${previousName}:uuid`);
        }
    }

    async getUUIDFromName(name: string): Promise<string | null> {
        return await redis.get(`player:username:${name}:uuid`);
    }

    async getNameFromUUID(uuid: string): Promise<string | null> {
        return await redis.get(`player:uuid:${uuid}:name`);
    }
}

export { RedisService };
