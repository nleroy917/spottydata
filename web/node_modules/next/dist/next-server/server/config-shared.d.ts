import { Header, Redirect, Rewrite } from '../../lib/load-custom-routes';
export declare type DomainLocales = Array<{
    http?: true;
    domain: string;
    locales?: string[];
    defaultLocale: string;
}>;
export declare type NextConfig = {
    [key: string]: any;
} & {
    cleanDistDir?: boolean;
    i18n?: {
        locales: string[];
        defaultLocale: string;
        domains?: DomainLocales;
        localeDetection?: false;
    } | null;
    headers?: () => Promise<Header[]>;
    rewrites?: () => Promise<Rewrite[] | {
        beforeFiles: Rewrite[];
        afterFiles: Rewrite[];
        fallback: Rewrite[];
    }>;
    redirects?: () => Promise<Redirect[]>;
    trailingSlash?: boolean;
    webpack5?: false;
    excludeDefaultMomentLocales?: boolean;
    future: {
        /**
         * @deprecated this options was moved to the top level
         */
        webpack5?: false;
        strictPostcssConfiguration?: boolean;
    };
    experimental: {
        cpus?: number;
        plugins?: boolean;
        profiling?: boolean;
        sprFlushToDisk?: boolean;
        reactMode?: 'legacy' | 'concurrent' | 'blocking';
        workerThreads?: boolean;
        pageEnv?: boolean;
        optimizeImages?: boolean;
        optimizeCss?: boolean;
        scrollRestoration?: boolean;
        stats?: boolean;
        externalDir?: boolean;
        conformance?: boolean;
        amp?: {
            optimizer?: any;
            validator?: string;
            skipValidation?: boolean;
        };
        reactRoot?: boolean;
        disableOptimizedLoading?: boolean;
        gzipSize?: boolean;
        craCompat?: boolean;
    };
};
export declare const defaultConfig: NextConfig;
export declare function normalizeConfig(phase: string, config: any): any;
