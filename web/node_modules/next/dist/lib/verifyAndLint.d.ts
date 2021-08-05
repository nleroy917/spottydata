import { Telemetry } from '../telemetry/storage';
export declare function verifyAndLint(dir: string, configLintDirs: string[] | undefined, numWorkers: number | undefined, enableWorkerThreads: boolean | undefined, telemetry: Telemetry): Promise<void>;
