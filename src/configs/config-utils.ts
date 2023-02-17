import fs from "fs";
import path from "path";

function loadConfig(name: string): unknown {
    return JSON.parse(fs.readFileSync(path.join(__dirname, "../../configs", name), "utf8"));
}

export { loadConfig };
