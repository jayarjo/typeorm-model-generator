"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Handlebars = require("handlebars");
const Prettier = require("prettier");
const changeCase = require("change-case");
const fs = require("fs");
const path = require("path");
const os_1 = require("os");
const IGenerationOptions_1 = require("./IGenerationOptions");
const prettierOptions = {
    parser: "typescript",
    endOfLine: "auto",
};
function modelGenerationPhase(connectionOptions, generationOptions, databaseModel) {
    createHandlebarsHelpers(generationOptions);
    const resultPath = generationOptions.resultsPath;
    if (!fs.existsSync(resultPath)) {
        fs.mkdirSync(resultPath);
    }
    let entitiesPath = resultPath;
    if (!generationOptions.noConfigs) {
        const tsconfigPath = path.resolve(resultPath, "tsconfig.json");
        const typeormConfigPath = path.resolve(resultPath, "ormconfig.json");
        createTsConfigFile(tsconfigPath, generationOptions);
        createTypeOrmConfig(typeormConfigPath, connectionOptions, generationOptions);
        entitiesPath = path.resolve(resultPath, "./entities");
        if (!fs.existsSync(entitiesPath)) {
            fs.mkdirSync(entitiesPath);
        }
    }
    if (generationOptions.indexFile) {
        createIndexFile(databaseModel, generationOptions, entitiesPath);
    }
    generateModels(databaseModel, generationOptions, entitiesPath);
}
exports.default = modelGenerationPhase;
function generateModels(databaseModel, generationOptions, entitiesPath) {
    const entityTemplatePath = path.resolve(generationOptions.templatesPath, "entity.mst");
    const entityTemplate = fs.readFileSync(entityTemplatePath, "utf-8");
    const entityCompliedTemplate = Handlebars.compile(entityTemplate, {
        noEscape: true,
    });
    databaseModel.forEach((element) => {
        let casedFileName = "";
        switch (generationOptions.convertCaseFile) {
            case "camel":
                casedFileName = changeCase.camelCase(element.fileName);
                break;
            case "param":
                casedFileName = changeCase.paramCase(element.fileName);
                break;
            case "pascal":
                casedFileName = changeCase.pascalCase(element.fileName);
                break;
            case "none":
                casedFileName = element.fileName;
                break;
            default:
                throw new Error("Unknown case style");
        }
        const resultFilePath = path.resolve(entitiesPath, `${casedFileName}.ts`);
        const rendered = entityCompliedTemplate(element);
        const withImportStatements = generationOptions.orm === "typeorm"
            ? removeUnusedImports(os_1.EOL !== IGenerationOptions_1.eolConverter[generationOptions.convertEol]
                ? rendered.replace(/(\r\n|\n|\r)/gm, IGenerationOptions_1.eolConverter[generationOptions.convertEol])
                : rendered)
            : rendered;
        let formatted = "";
        try {
            formatted = Prettier.format(withImportStatements, prettierOptions);
        }
        catch (error) {
            console.error("There were some problems with model generation for table: ", element.sqlName);
            console.error(error);
            formatted = withImportStatements;
        }
        fs.writeFileSync(resultFilePath, formatted, {
            encoding: "utf-8",
            flag: "w",
        });
    });
}
function createIndexFile(databaseModel, generationOptions, entitiesPath) {
    const templatePath = path.resolve(generationOptions.templatesPath, "index.mst");
    const template = fs.readFileSync(templatePath, "utf-8");
    const compliedTemplate = Handlebars.compile(template, {
        noEscape: true,
    });
    const rendered = compliedTemplate({ entities: databaseModel });
    const formatted = Prettier.format(rendered, prettierOptions);
    let fileName = "index";
    switch (generationOptions.convertCaseFile) {
        case "camel":
            fileName = changeCase.camelCase(fileName);
            break;
        case "param":
            fileName = changeCase.paramCase(fileName);
            break;
        case "pascal":
            fileName = changeCase.pascalCase(fileName);
            break;
        default:
    }
    const resultFilePath = path.resolve(entitiesPath, `${fileName}.ts`);
    fs.writeFileSync(resultFilePath, formatted, {
        encoding: "utf-8",
        flag: "w",
    });
}
function removeUnusedImports(rendered) {
    const openBracketIndex = rendered.indexOf("{") + 1;
    const closeBracketIndex = rendered.indexOf("}");
    const imports = rendered
        .substring(openBracketIndex, closeBracketIndex)
        .split(",");
    const restOfEntityDefinition = rendered.substring(closeBracketIndex);
    const distinctImports = imports.filter((v) => restOfEntityDefinition.indexOf(`@${v}(`) !== -1 ||
        (v === "BaseEntity" && restOfEntityDefinition.indexOf(v) !== -1));
    return `${rendered.substring(0, openBracketIndex)}${distinctImports.join(",")}${restOfEntityDefinition}`;
}
function createHandlebarsHelpers(generationOptions) {
    // eslint-disable-next-line  import/no-dynamic-require, @typescript-eslint/no-var-requires, global-require
    const helpers = require(generationOptions.helpersPaths)(generationOptions);
    Object.keys(helpers).forEach((name) => Handlebars.registerHelper(name, helpers[name]));
}
function createTsConfigFile(tsconfigPath, generationOptions) {
    if (fs.existsSync(tsconfigPath)) {
        console.warn(`\x1b[33m[${new Date().toLocaleTimeString()}] WARNING: Skipping generation of tsconfig.json file. File already exists. \x1b[0m`);
        return;
    }
    const templatePath = path.resolve(generationOptions.templatesPath, "tsconfig.mst");
    const template = fs.readFileSync(templatePath, "utf-8");
    const compliedTemplate = Handlebars.compile(template, {
        noEscape: true,
    });
    const rendered = compliedTemplate({});
    const formatted = Prettier.format(rendered, { parser: "json" });
    fs.writeFileSync(tsconfigPath, formatted, {
        encoding: "utf-8",
        flag: "w",
    });
}
function createTypeOrmConfig(typeormConfigPath, connectionOptions, generationOptions) {
    if (fs.existsSync(typeormConfigPath)) {
        console.warn(`\x1b[33m[${new Date().toLocaleTimeString()}] WARNING: Skipping generation of ormconfig.json file. File already exists. \x1b[0m`);
        return;
    }
    const templatePath = path.resolve(generationOptions.templatesPath, "ormconfig.mst");
    const template = fs.readFileSync(templatePath, "utf-8");
    const compiledTemplate = Handlebars.compile(template, {
        noEscape: true,
    });
    const rendered = compiledTemplate(connectionOptions);
    const formatted = Prettier.format(rendered, { parser: "json" });
    fs.writeFileSync(typeormConfigPath, formatted, {
        encoding: "utf-8",
        flag: "w",
    });
}
//# sourceMappingURL=ModelGeneration.js.map