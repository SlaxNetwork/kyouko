import { CookieClickerProfile } from "@prisma/client";
import prisma from "../../database/prisma-client";
import { Service } from "typedi";

@Service()
class CookieClickerService {
    private async create(uuid: string): Promise<CookieClickerProfile> {
        const cookieClickerProfile = await prisma.cookieClickerProfile.create({
            data: {}
        });

        await prisma.profile.update({
            where: {
                id: uuid
            },
            data: {
                cookieClickerProfileId: cookieClickerProfile.id
            }
        });

        return cookieClickerProfile;
    }

    async findByUUID(uuid: string): Promise<CookieClickerProfile | null> {
        const profile = await prisma.profile.findFirst({
            where: {
                id: uuid
            },
            select: {
                cookieClickerProfile: true
            }
        });

        if (!profile) {
            return null;
        }

        if (!profile.cookieClickerProfile) {
            return this.create(uuid);
        }

        return profile.cookieClickerProfile;
    }
}

export { CookieClickerService };
