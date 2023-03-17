type SimpleMojangProfile = {
    uuid: string;
    username: string;
};

/**
 * Get the {@link SimpleMojangProfile} of a player.
 * @param query UUID or Username.
 * @returns {SimpleMojangProfile} {@link SimpleMojangProfile} or null if an error has occurred.
 */
async function getMojangProfile(query: string): Promise<SimpleMojangProfile | null> {
    const res = await fetch(`https://api.ashcon.app/mojang/v2/user/${query}`).then(res => res.json()).catch(() => {
        return null;
    });
    if (!res.error) {
        return res;
    }
    return null;
}

export { getMojangProfile, SimpleMojangProfile };
