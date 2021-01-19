import * as changeCase from "change-case";
import { plural, singular } from "pluralize";
import IGenerationOptions from "../IGenerationOptions";
import commonHelpers from "./common";
import { Column } from "../models/Column";
import { Relation } from "../models/Relation";

module.exports = (generationOptions: IGenerationOptions) => ({
    ...commonHelpers(generationOptions),

    toClassName(tableName: string, suffix = "") {
        let retStr = "";
        switch (generationOptions.convertCaseEntity) {
            case "camel":
                retStr = changeCase.camelCase(tableName);
                break;
            case "pascal":
                retStr = changeCase.pascalCase(tableName);
                break;
            case "none":
                retStr = tableName;
                break;
            default:
                throw new Error("Unknown case style");
        }
        return `${
            generationOptions.pluralizeNames ? plural(retStr) : singular(retStr)
        }${suffix}`;
    },

    printHasTimestamps(columns: Column[]) {
        let hasCreatedAt = false;
        let hasUpdatedAt = false;
        columns.forEach((col: Column) => {
            if (col.tscName === "created_at") {
                hasCreatedAt = true;
            }
            if (col.tscName === "updated_at") {
                hasUpdatedAt = true;
            }
        });
        return `get hasTimestamps() {
            return ${hasCreatedAt && hasUpdatedAt};
        }`;
    },

    printGeometries(columns: Column[]) {
        const geometries = columns.reduce(
            (cols: string[], col: Column) =>
                col.type === "geometry" ? [...cols, col.tscName] : cols,
            []
        );
        return geometries.length
            ? `get geometry(): string[] {
                return ['${geometries.join(", ")}'];
            }`
            : "";
    },

    printArray(arr: any[]) {
        return `[${arr
            .map((item) => (typeof item === "number" ? item : `'${item}'`))
            .join(", ")}]`;
    },

    printIdAttribute(columns: Column[]) {
        const primaryKeysCount = columns.reduce(
            (sum: number, col: Column) => (col.primary ? sum + 1 : sum),
            0
        );
        return primaryKeysCount !== 1
            ? `get idAttribute() { 
            return null 
        }`
            : "";
    },

    printUuid(columns: Column[]) {
        const hasUuid = columns.find(
            (col) => col.primary && col.type === "uuid"
        );
        return hasUuid
            ? `get uuid() { 
            return true 
        }`
            : "";
    },

    toRelationMethod(relationType: string) {
        switch (relationType) {
            case "OneToOne":
                return "hasOne";
            case "OneToMany":
                return "hasMany";
            case "ManyToOne":
                return "belongsTo";
            case "ManyToMany":
                return "belongsToMany";
            default:
                // should never happen, but prepare to crash vocally
                return `UNSUPPORTED_RELATION: ${relationType}`;
        }
    },

    printJoinOptions(relation: Relation) {
        switch (relation.relationType) {
            case "OneToOne":
                return "";
            case "OneToMany":
                return `, '${relation.joinColumnOptions?.[0].referencedColumnName}'`;
            case "ManyToOne":
                return `, '${relation.joinColumnOptions?.[0].name}'`;
            case "ManyToMany":
                return `, '${relation.joinTableOptions?.name}', '${relation.joinTableOptions?.joinColumns?.[0].name}', '${relation.joinTableOptions?.inverseJoinColumns?.[0].name}'`;

            default:
                // should never happen, but prepare to crash vocally
                return `UNSUPPORTED_RELATION: ${relation.relationType}`;
        }
    },
});
