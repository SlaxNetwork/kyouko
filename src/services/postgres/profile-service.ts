import { Profile } from "@prisma/client";
import { getMojangProfile } from "../../utils/mojang-utils";
import { httpError } from "../../utils/error-utils";
import { isUUID } from "class-validator";
import { Service } from "typedi";
import prisma from "../../database/prisma-client";

/**
 * Generic database actions on {@link Profile}.
 */
@Service()
class ProfileService {
    /**
     * Create a base {@link Profile}.
     * @param uuid Player UUID.
     * @returns {Promise<Profile>} The created profile from prisma.
     */
    private async create(uuid: string): Promise<Profile> {
        const mojangProfile = await getMojangProfile(uuid);

        if (!mojangProfile) {
            throw httpError({
                message: `could not get profile for ${uuid}`,
                httpCode: 404
            });
        }

        const settings = await prisma.profileSettings.create({
            data: {}
        });

        return prisma.profile.create({
            data: {
                id: mojangProfile.uuid,
                profileSettingsId: settings.id
            }
        });
    }

    /**
     * Find a profile based on a UUID.
     * @param uuid Id to query by.
     * @returns {Profile} {@link Profile} or null if none matches the query.
     */
    async findByUUID(uuid: string): Promise<Profile | null> {
        if (!isUUID(uuid)) {
            throw "invalid uid passed.";
        }

        const profile = await prisma.profile.findFirst({
            where: { id: uuid }
        });

        if (!profile) {
            return await this.create(uuid);
        }

        return profile;
    }
}

export { ProfileService };
