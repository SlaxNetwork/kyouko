import { Service } from "typedi";
import redis from "../../database/redis-client";
import { httpError } from "../../utils/error-utils";
import { CreateServerBody, ServerType } from "../../controllers/requests/server-requests";
import { generateRandomString } from "../../utils/string-utils";
import { notFoundError } from "../../controllers/errors/generc.error";

type ServerInstance = {
    ip: string;
    port: number;
    type: ServerType;
};

@Service()
class ServerService {
    /**
     * Register a new server instance.
     * @param param0 Server properties.
     * @returns The instance id.
     */
    async registerServerInstance({ ip, port, type }: CreateServerBody): Promise<string> {
        /**
         * Generate a instance id that is not already in use.
         * @returns The instance id.
         */
        const generateInstanceId = async (fails: number = 0): Promise<string> => {
            if (fails > 5) {
                throw httpError({
                    message: "failed to generate id after 5 tries",
                    httpCode: 500
                });
            }

            const id = generateRandomString(12);
            if (await this.doesInstanceExist(id)) {
                return generateInstanceId(fails++);
            }

            return id;
        };

        const instanceId = await generateInstanceId();

        await redis.sAdd(`server:instances`, instanceId);

        const redisKey = `server:${instanceId}`;
        await redis.hSet(redisKey, "ip", ip);
        await redis.hSet(redisKey, "port", port);
        await redis.hSet(redisKey, "type", type);
        await redis.hSet(redisKey, "players", 0);

        return instanceId;
    }

    /**
     * Delete a server instance from the registry.
     * @param instanceId Instance id.
     */
    async deleteServerInstance(instanceId: string) {
        await redis.sRem(`server:instances`, instanceId);

        const redisKey = `server:${instanceId}`;
        await redis.del(redisKey);
    }

    async updatePlayerCount(instanceId: string, players: number): Promise<void> {
        if (!this.doesInstanceExist(instanceId)) {
            throw notFoundError;
        }

        await redis.hSet(`server:${instanceId}`, "players", players);
    }

    /**
     * Find a instance based on its id.
     * @param id Instance id.
     * @returns {ServerInstance} {@link ServerInstance} or {@link null} if none was found.
     */
    async findServerInstanceById(id: string): Promise<ServerInstance | null> {
        if (!(await this.doesInstanceExist(id))) {
            return null;
        }

        const instance = await redis.hGetAll(`server:${id}`);

        return instance as unknown as ServerInstance;
    }

    async doesInstanceExist(id: string): Promise<boolean> {
        return await redis.sIsMember("server:instances", id);
    }

    /**
     * @returns All registered server instances.
     */
    async getServerInstances(): Promise<ServerInstance[]> {
        const instances: ServerInstance[] = [];

        const instanceIds = await redis.sMembers("server:instances");
        for (const instanceId of instanceIds) {
            const inst = await this.findServerInstanceById(instanceId);
            if (!inst) {
                continue;
            }

            instances.push(inst);
        }

        return instances;
    }
}

export { ServerService };
