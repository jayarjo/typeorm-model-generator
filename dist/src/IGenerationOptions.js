"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultGenerationOptions = exports.eolConverter = void 0;
const os_1 = require("os");
const path = require("path");
exports.eolConverter = {
    LF: "\n",
    CRLF: "\r\n",
};
function getDefaultGenerationOptions() {
    const orm = "bookshelf";
    const generationOptions = {
        resultsPath: path.resolve(process.cwd(), "output"),
        templatesPath: path.resolve(__dirname, `./templates/${orm}`),
        helpersPaths: path.resolve(__dirname, `./helpers/${orm}`),
        pluralizeNames: false,
        noConfigs: true,
        convertCaseFile: "none",
        convertCaseEntity: "pascal",
        convertCaseProperty: "camel",
        convertEol: os_1.EOL === "\n" ? "LF" : "CRLF",
        propertyVisibility: "none",
        lazy: false,
        activeRecord: false,
        generateConstructor: false,
        customNamingStrategyPath: "",
        relationIds: false,
        strictMode: "none",
        skipSchema: false,
        indexFile: true,
        exportType: "named",
        orm,
        relationAliases: {},
    };
    return generationOptions;
}
exports.getDefaultGenerationOptions = getDefaultGenerationOptions;
//# sourceMappingURL=IGenerationOptions.js.map