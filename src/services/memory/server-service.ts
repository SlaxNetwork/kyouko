import { Service } from "typedi";
import { ServerBody } from "../../controllers/server-controller";
import { BadRequestError } from "routing-controllers";

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
        if (!type) throw new BadRequestError("Invalid body");
        
        const possibleServer = this.findByAddress(ip, port);
        if (possibleServer) return possibleServer;

        const server = new Server(ip, port, type);

        this.servers.add(server);
        return server;
    }

    remove(ip: string, port: number): boolean {
        const server = this.findByAddress(ip, port);
        if(!server) return false;
        return this.servers.delete(server);
    }

    findByAddress(ip: string, port: number): Server | null {
        return [...this.servers].find(server => server.ip === ip && server.port === port) ?? null;
    }

    getAll(): Set<Server> {
        return this.servers;
    }
}

export { ServerService, Server, ServerType };
