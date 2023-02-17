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
        const flatObj = flattenObject(iconsConfig);

        return Object.keys(flatObj).map((k) => ({ name: k, char: flatObj[k] } as Icon));
    }
}

export { IconService };
