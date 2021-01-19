"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const changeCase = require("change-case");
const pluralize_1 = require("pluralize");
const common_1 = require("./common");
module.exports = (generationOptions) => (Object.assign(Object.assign({}, common_1.default(generationOptions)), { toClassName(tableName, suffix = "") {
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
        return `${generationOptions.pluralizeNames ? pluralize_1.plural(retStr) : pluralize_1.singular(retStr)}${suffix}`;
    }, printHasTimestamps(columns) {
        let hasCreatedAt = false;
        let hasUpdatedAt = false;
        columns.forEach((col) => {
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
    printGeometries(columns) {
        const geometries = columns.reduce((cols, col) => col.type === "geometry" ? [...cols, col.tscName] : cols, []);
        return geometries.length
            ? `get geometry(): string[] {
                return ['${geometries.join(", ")}'];
            }`
            : "";
    }, printArray(arr) {
        return `[${arr
            .map((item) => (typeof item === "number" ? item : `'${item}'`))
            .join(", ")}]`;
    },
    printIdAttribute(columns) {
        const primaryKeysCount = columns.reduce((sum, col) => col.primary ? sum + 1 : sum);
        return primaryKeysCount !== 1
            ? `get idAttribute() { 
            return null 
        }`
            : "";
    },
    toRelationMethod(relationType) {
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
    }, printJoinOptions(relation) {
        var _a, _b, _c, _d, _e, _f, _g;
        switch (relation.relationType) {
            case "OneToOne":
                return "";
            case "OneToMany":
                return `, '${(_a = relation.joinColumnOptions) === null || _a === void 0 ? void 0 : _a[0].referencedColumnName}'`;
            case "ManyToOne":
                return `, '${(_b = relation.joinColumnOptions) === null || _b === void 0 ? void 0 : _b[0].name}'`;
            case "ManyToMany":
                return `, '${(_c = relation.joinTableOptions) === null || _c === void 0 ? void 0 : _c.name}', '${(_e = (_d = relation.joinTableOptions) === null || _d === void 0 ? void 0 : _d.joinColumns) === null || _e === void 0 ? void 0 : _e[0].name}', '${(_g = (_f = relation.joinTableOptions) === null || _f === void 0 ? void 0 : _f.inverseJoinColumns) === null || _g === void 0 ? void 0 : _g[0].name}'`;
            default:
                // should never happen, but prepare to crash vocally
                return `UNSUPPORTED_RELATION: ${relation.relationType}`;
        }
    } }));
//# sourceMappingURL=bookshelf.js.map