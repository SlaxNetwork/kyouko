import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createPrismaDefaults() {
    const createDefaultRank = async () => {
        const rank = await prisma.rank.findFirst({
            where: {
                id: "default"
            }
        });

        if (!rank) {
            await prisma.rank.create({
                data: {
                    id: "default",
                    name: "Default",
                    prefixId: "rank_default"
                }
            });
        }
    };

    await createDefaultRank();
}

export { createPrismaDefaults };
export default prisma;
