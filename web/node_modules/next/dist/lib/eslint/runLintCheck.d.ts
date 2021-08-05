import { NecessaryDependencies } from '../has-necessary-dependencies';
import { EventLintCheckCompleted } from '../../telemetry/events/build';
declare function lint(deps: NecessaryDependencies, baseDir: string, lintDirs: string[], eslintrcFile: string | null, pkgJsonPath: string | null, eslintOptions?: any, reportErrorsOnly?: boolean): Promise<string | null | {
    output: string | null;
    isError: boolean;
    eventInfo: EventLintCheckCompleted;
}>;
export declare function runLintCheck(baseDir: string, lintDirs: string[], lintDuringBuild?: boolean, eslintOptions?: any, reportErrorsOnly?: boolean): ReturnType<typeof lint>;
export {};
