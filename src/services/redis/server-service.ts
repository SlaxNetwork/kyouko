import { Service } from "typedi";
import redis from "../../database/redis-client";
import { httpError } from "../../utils/error-utils";
import { isNotEmptyObject, isNumber } from "class-validator";
import { CreateServerBody } from "../../controllers/requests/server-requests";

type ServerInstance = {
    ip: string;
    port: number;
};

@Service()
class ServerService {
    // TODO: Switch to random ids.
    private tmpNumber: number = 0;

    async createServerInstance({ ip, port, type }: CreateServerBody): Promise<string> {
        const instanceId = (this.tmpNumber++).toString();

        await redis.sAdd(`server:instances`, instanceId);

        const redisKey = `server:${instanceId}`;
        await redis.hSet(redisKey, "ip", ip);
        await redis.hSet(redisKey, "port", port);
        await redis.hSet(redisKey, "type", type);

        return instanceId;
    }

    async deleteServerInstance(instanceId: string) {
        await redis.sRem(`server:instances`, instanceId);

        const redisKey = `server:${instanceId}`;
        await redis.del(redisKey);
    }

    async findServerInstanceById(id: string): Promise<ServerInstance | null> {
        const instance = await redis.hGetAll(`server:${id}`);

        if (!("ip" in instance)) {
            return null;
        }

        return instance as unknown as ServerInstance;
    }

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
