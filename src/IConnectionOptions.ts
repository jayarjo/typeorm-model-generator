// TODO: change name

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export default interface IConnectionOptions {
    host: string;
    port: number;
    databaseNames: string[];
    user: string;
    password: string;
    databaseType:
        | "mssql"
        | "postgres"
        | "mysql"
        | "mariadb"
        | "oracle"
        | "sqlite";
    schemaNames: string[];
    instanceName?: string;
    ssl: boolean;
    skipTables: string[];
    onlyTables: string[];
    retrieveViews?: boolean;
}

export function getDefaultConnectionOptions(): IConnectionOptions {
    const connectionOptions: IConnectionOptions = {
        host: "127.0.0.1",
        port: 0,
        databaseNames: [""],
        user: "",
        password: "",
        databaseType: undefined as any,
        schemaNames: [""],
        instanceName: undefined,
        ssl: false,
        skipTables: ["spatial_ref_sys", "schema_migrations"],
        onlyTables: [],
        retrieveViews: true,
    };
    return connectionOptions;
}
