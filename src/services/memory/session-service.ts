import { Service } from "typedi";

class PlayerSession {
    constructor(public readonly uuid: string, public currentServer: string) {}
}

@Service()
class SessionService {
    private activeSessions: Map<string, PlayerSession>;

    constructor() {
        this.activeSessions = new Map();
    }

    create(uuid: string, currentServer: string): PlayerSession {
        const session = new PlayerSession(uuid, currentServer);

        this.activeSessions.set(uuid, session);
        return session;
    }

    remove(uuid: string): boolean {
        return this.activeSessions.delete(uuid);
    }

    findByUUID(uuid: string): PlayerSession | undefined {
        return this.activeSessions.get(uuid);
    }
}

export { SessionService };
