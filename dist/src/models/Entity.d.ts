import { Column } from "./Column";
import { Relation } from "./Relation";
import { Index } from "./Index";
import { RelationId } from "./RelationId";
export declare type Entity = {
    sqlName: string;
    tscName: string;
    database?: string;
    schema?: string;
    columns: Column[];
    relationIds: RelationId[];
    relations: Relation[];
    indices: Index[];
    fileName: string;
    fileImports: {
        entityName: string | string[];
        fileName: string;
        isRelation?: boolean;
    }[];
    activeRecord?: true;
    generateConstructor?: true;
    isView?: boolean;
};
