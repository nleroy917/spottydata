export declare type NecessaryDependencies = {
    resolved: Map<string, string>;
};
export declare function hasNecessaryDependencies(baseDir: string, checkTSDeps: boolean, checkESLintDeps: boolean, lintDuringBuild?: boolean): Promise<NecessaryDependencies>;
