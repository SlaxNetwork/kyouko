import { Service } from "typedi";
import { ServerBody } from "../../controllers/server-controller";
import { httpError } from "../../utils/error-utils";

type ServerType = "lobby" | "cookieclicker";

class Server {
    constructor(public readonly ip: string, public readonly port: number, public readonly type: ServerType) {}
}

@Service()
class ServerService {
    private servers: Set<Server>;

    constructor() {
        this.servers = new Set();
    }

    create({ ip, port, type }: ServerBody): Server {
        const possibleServer = this.findByAddress(ip, port);
        if (possibleServer) {
            return possibleServer;
        }

        // todo: update
        if (!type) {
            throw httpError({
                httpCode: 400,
                message: "invalid body :("
            });
        }

        const server = new Server(ip, port, type);

        this.servers.add(server);
        return server;
    }

    remove(ip: string, port: number): boolean {
        const server = this.findByAddress(ip, port);

        if (server) {
            return this.servers.delete(server);
        }
        return false;
    }

    findByAddress(ip: string, port: number): Server | null {
        let server: Server | null = null;

        this.servers.forEach((s) => {
            if (s.ip === ip && s.port === port) {
                server = s;
            }
        });

        return server;
    }

    getAll(): Set<Server> {
        return this.servers;
    }
}

export { ServerService, Server, ServerType };
