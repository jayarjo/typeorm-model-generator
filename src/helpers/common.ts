import * as changeCase from "change-case";
import { Relation } from "../models/Relation";

export default (generationOptions) => ({
    toFileName(str) {
        let retStr = "";
        switch (generationOptions.convertCaseFile) {
            case "camel":
                retStr = changeCase.camelCase(str);
                break;
            case "param":
                retStr = changeCase.paramCase(str);
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

    printPropertyVisibility() {
        return generationOptions.propertyVisibility !== "none"
            ? `${generationOptions.propertyVisibility} `
            : "";
    },

    toPropertyName(str) {
        let retStr = "";
        switch (generationOptions.convertCaseProperty) {
            case "camel":
                retStr = changeCase.camelCase(str);
                break;
            case "pascal":
                retStr = changeCase.pascalCase(str);
                break;
            case "none":
                retStr = str;
                break;
            case "snake":
                retStr = changeCase.snakeCase(str);
                break;
            default:
                throw new Error("Unknown case style");
        }
        return retStr;
    },

    toRelation(entityType: string, relationType: Relation["relationType"]) {
        let retVal = entityType;
        if (relationType === "ManyToMany" || relationType === "OneToMany") {
            retVal = `${retVal}[]`;
        }
        if (generationOptions.lazy) {
            retVal = `Promise<${retVal}>`;
        }
        return retVal;
    },

    defaultExport() {
        return generationOptions.exportType === "default" ? "default" : "";
    },

    localImport(entityName: string) {
        return generationOptions.exportType === "default"
            ? entityName
            : `{${entityName}}`;
    },

    strictMode() {
        return generationOptions.strictMode !== "none"
            ? generationOptions.strictMode
            : "";
    },

    and(v1, v2) {
        return v1 && v2;
    },
    eq(v1, v2) {
        return v1 === v2;
    },
    gt(v1, v2) {
        return v1 > v2;
    },
    gte(v1, v2) {
        return v1 >= v2;
    },
    lt(v1, v2) {
        return v1 < v2;
    },
    lte(v1, v2) {
        return v1 <= v2;
    },
    ne(v1, v2) {
        return v1 !== v2;
    },
    or(v1, v2) {
        return v1 || v2;
    },
});
