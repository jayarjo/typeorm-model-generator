"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const changeCase = require("change-case");
const common_1 = require("./common");
exports.default = (generationOptions) => (Object.assign(Object.assign({}, common_1.default(generationOptions)), { json(context) {
        const json = JSON.stringify(context);
        const withoutQuotes = json.replace(/"([^(")"]+)":/g, "$1:");
        return withoutQuotes.slice(1, withoutQuotes.length - 1);
    },
    toEntityName(str) {
        let retStr = "";
        switch (generationOptions.convertCaseEntity) {
            case "camel":
                retStr = changeCase.camelCase(str);
                break;
            case "pascal":
                retStr = changeCase.pascalCase(str);
                break;
            case "none":
                retStr = str;
                break;
            default:
                throw new Error("Unknown case style");
        }
        return retStr;
    } }));
//# sourceMappingURL=typeorm.js.map