import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export default prisma;

async function createDefaultRank() {
    await prisma.rank.upsert({
        where: {
            id: "default"
        },
        update: {
            name: "Default",
            prefixId: "rank_default"
        },
        create: {
            id: "default",
            name: "Default",
            prefixId: "rank_default"
        }
    });
}

export async function createPrismaDefaults() {
    await createDefaultRank();
}
