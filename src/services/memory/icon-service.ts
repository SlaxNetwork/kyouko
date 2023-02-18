import { Service } from "typedi";
import { flattenObject } from "../../utils/object-utils";
import iconsConfig from "../../configs/icons-config";

type Icon = {
    name: string;
    char: string;
};

@Service()
class IconService {
    getAll(): Icon[] {
        // Flatten object will turn this { a: { b: 1 } } into
        // { a_b: 1 }, we use this to properly map icon names to their character.
        const flatObj = flattenObject(iconsConfig);

        // list of icon pairs
        return Object.keys(flatObj).map((k) => ({ name: k, char: flatObj[k] } as Icon));
    }
}

export { IconService };
