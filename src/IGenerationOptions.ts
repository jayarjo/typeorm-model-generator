import { EOL } from "os";

import path = require("path");

// TODO: change name

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export default interface IGenerationOptions {
    resultsPath: string;
    pluralizeNames: boolean;
    noConfigs: boolean;
    convertCaseFile: "pascal" | "param" | "camel" | "none";
    convertCaseEntity: "pascal" | "camel" | "none";
    convertCaseProperty: "pascal" | "camel" | "snake" | "none";
    convertEol: "LF" | "CRLF";
    propertyVisibility: "public" | "protected" | "private" | "none";
    lazy: boolean;
    activeRecord: boolean;
    generateConstructor: boolean;
    customNamingStrategyPath: string;
    relationIds: boolean;
    strictMode: "none" | "?" | "!";
    skipSchema: boolean;
    indexFile: boolean;
    exportType: "named" | "default";
    orm: "typeorm" | "bookshelf";
    relationAliases: Record<string, string>;
    templatesPath: string;
    helpersPaths: string;
}

export const eolConverter = {
    LF: "\n",
    CRLF: "\r\n",
};

export function getDefaultGenerationOptions(): IGenerationOptions {
    const orm = "bookshelf";
    const generationOptions: IGenerationOptions = {
        resultsPath: path.resolve(process.cwd(), "output"),
        templatesPath: path.resolve(__dirname, `./templates/${orm}`),
        helpersPaths: path.resolve(__dirname, `./helpers/${orm}`),
        pluralizeNames: false,
        noConfigs: true,
        convertCaseFile: "none",
        convertCaseEntity: "pascal",
        convertCaseProperty: "camel",
        convertEol: EOL === "\n" ? "LF" : "CRLF",
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
