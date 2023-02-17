import fs from "fs";
import { loadConfig } from "./config-utils";

type IconsConfig = {
    ranks: { [key: string]: string };
};

export default loadConfig("icons.json") as IconsConfig;
