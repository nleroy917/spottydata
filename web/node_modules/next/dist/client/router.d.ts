/// <reference types="node" />
import React from 'react';
import Router, { NextRouter } from '../next-server/lib/router/router';
declare type SingletonRouterBase = {
    router: Router | null;
    readyCallbacks: Array<() => any>;
    ready(cb: () => any): void;
};
export { Router, NextRouter };
export declare type SingletonRouter = SingletonRouterBase & NextRouter;
declare const routerEvents: readonly ["routeChangeStart", "beforeHistoryChange", "routeChangeComplete", "routeChangeError", "hashChangeStart", "hashChangeComplete"];
export declare type RouterEvent = typeof routerEvents[number];
declare const _default: SingletonRouter;
export default _default;
export { default as withRouter } from './with-router';
export declare function useRouter(): NextRouter;
export declare const createRouter: (args_0: string, args_1: import("querystring").ParsedUrlQuery, args_2: string, args_3: {
    subscription: (data: import("../next-server/lib/router/router").PrivateRouteInfo, App: import("../next-server/lib/router/router").AppComponent, resetScroll: {
        x: number;
        y: number;
    } | null) => Promise<void>;
    initialProps: any;
    pageLoader: any;
    Component: React.ComponentType<{}>;
    App: import("../next-server/lib/router/router").AppComponent;
    wrapApp: (WrapAppComponent: import("../next-server/lib/router/router").AppComponent) => any;
    err?: Error | undefined;
    isFallback: boolean;
    locale?: string | undefined;
    locales?: string[] | undefined;
    defaultLocale?: string | undefined;
    domainLocales?: import("../next-server/server/config-shared").DomainLocales | undefined;
    isPreview?: boolean | undefined;
}) => Router;
export declare function makePublicRouterInstance(router: Router): NextRouter;
