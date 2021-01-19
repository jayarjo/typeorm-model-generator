import * as changeCase from "change-case";
import commonHelpers from "./common";

module.exports = (generationOptions) => ({
    ...commonHelpers(generationOptions),

    json(context) {
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
    },

    localImport(...importNames: string[]) {
        return generationOptions.exportType === "default"
            ? importNames[0]
            : `{${importNames.join(", ")}}`;
    },
});
