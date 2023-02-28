const ALPHA_NUMERIC = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

// https://stackoverflow.com/a/12502559
/**
 * Generate a string random alpha-numeric string of a specified length.
 * @param len Length the random string should be.
 * @returns The randomly generated string.
 */
function generateRandomString(len: number): string {
    if (len < 0) {
        throw "length cannot be lower than 0.";
    }

    let str = "";
    for (let i = len; i > 0; i--) {
        str += ALPHA_NUMERIC[Math.floor(Math.random() * len)];
    }

    return str;
}

export { generateRandomString };
