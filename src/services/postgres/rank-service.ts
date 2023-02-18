import { Rank } from "@prisma/client";
import { Service } from "typedi";
import prisma from "../../database/prisma-client";

@Service()
class RankService {
    async getAll(): Promise<Rank[]> {
        return await prisma.rank.findMany({});
    }
}

export { RankService };
