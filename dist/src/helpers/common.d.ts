import { Relation } from "../models/Relation";
declare const _default: (generationOptions: any) => {
    toFileName(str: any): string;
    printPropertyVisibility(): string;
    toPropertyName(str: any): string;
    toRelation(entityType: string, relationType: Relation["relationType"]): string;
    defaultExport(): "default" | "";
    strictMode(): any;
    and(v1: any, v2: any): any;
    eq(v1: any, v2: any): boolean;
    gt(v1: any, v2: any): boolean;
    gte(v1: any, v2: any): boolean;
    lt(v1: any, v2: any): boolean;
    lte(v1: any, v2: any): boolean;
    ne(v1: any, v2: any): boolean;
    or(v1: any, v2: any): any;
};
export default _default;
