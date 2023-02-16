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
    const url = new URL(`https://api.ashcon.app/mojang/v2/user/${query}`);

    const res = await fetch(url).catch(() => {
        return null;
    });

    if (!res) {
        return null;
    }

    const json = await res.json();
    if (!json.error) {
        return json;
    }

    return null;
}

export { getMojangProfile, SimpleMojangProfile };
