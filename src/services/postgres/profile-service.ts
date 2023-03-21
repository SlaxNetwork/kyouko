import { Profile } from "@prisma/client";
import { getMojangProfile } from "../../utils/mojang-utils";
import { isUUID } from "class-validator";
import { Service } from "typedi";
import prisma from "../../database/prisma-client";
import { NotFoundError, BadRequestError } from "routing-controllers";

/**
 * Generic database actions on {@link Profile}.
 */
@Service()
export class ProfileService {
    /**
     * Create a base {@link Profile}.
     * @param uuid Player UUID.
     * @returns {Promise<Profile>} The created profile from prisma.
     */
    private async create(uuid: string): Promise<Profile> {
        const mojangProfile = await getMojangProfile(uuid);

        if (!mojangProfile) throw new NotFoundError(`could not get profile for ${uuid}`);

        const settings = await prisma.profileSettings.create({
            data: {}
        });

        return prisma.profile.create({
            data: {
                id: mojangProfile.uuid,
                profileSettingsId: settings.id
            },
            include: {
                settings: true,
                rank: true
            }
        });
    }

    /**
     * Find a profile based on a UUID.
     * @param uuid UUID to query by.
     * @returns {Profile} {@link Profile}
     */
    async findByUUID(uuid: string): Promise<Profile> {
        if (!isUUID(uuid)) throw new BadRequestError("Invalid UUID passed.");

        const profile = await prisma.profile.findFirst({
            where: { id: uuid },
            include: {
                settings: true,
                rank: true
            }
        });

        if (!profile) {
            return await this.create(uuid);
        }

        return profile;
    }
}
