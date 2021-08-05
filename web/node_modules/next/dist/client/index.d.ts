import '@next/polyfill-module';
import { MittEmitter } from '../next-server/lib/mitt';
import Router, { AppComponent, PrivateRouteInfo } from '../next-server/lib/router/router';
import { NEXT_DATA } from '../next-server/lib/utils';
declare global {
    interface Window {
        __NEXT_HYDRATED?: boolean;
        __NEXT_HYDRATED_CB?: () => void;
        __NEXT_PRELOADREADY?: (ids?: (string | number)[]) => void;
        __NEXT_DATA__: NEXT_DATA;
        __NEXT_P: any[];
    }
}
declare type RenderRouteInfo = PrivateRouteInfo & {
    App: AppComponent;
    scroll?: {
        x: number;
        y: number;
    } | null;
};
declare type RenderErrorProps = Omit<RenderRouteInfo, 'Component' | 'styleSheets'>;
export declare const version: string | undefined;
declare let webpackHMR: any;
export declare let router: Router;
export declare const emitter: MittEmitter<string>;
declare const _default: (opts?: {
    webpackHMR?: any;
}) => Promise<MittEmitter<string> | {
    emitter: MittEmitter<string>;
    render: typeof render;
    renderCtx: Omit<import("../next-server/lib/router/router").CompletePrivateRouteInfo, "styleSheets"> & {
        initial: true;
    } & {
        App: AppComponent;
        scroll?: {
            x: number;
            y: number;
        } | null | undefined;
    };
}>;
export default _default;
export declare function render(renderingProps: RenderRouteInfo): Promise<void>;
export declare function renderError(renderErrorProps: RenderErrorProps): Promise<any>;
