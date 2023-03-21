// via https://www.w3resource.com/javascript-exercises/fundamental/javascript-fundamental-exercise-233.php
export function flattenObject(obj: any, prefix: string = ""): any {
    return Object.keys(obj).reduce((acc: any, k: any) => {
        const pre = prefix.length ? `${prefix}_` : "";

        if (typeof obj[k] === "object") {
            Object.assign(acc, flattenObject(obj[k], pre + k));
        } else {
            acc[pre + k] = obj[k];
        }

        return acc;
    }, {});
}
