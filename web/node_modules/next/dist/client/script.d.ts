import React from 'react';
import { ScriptHTMLAttributes } from 'react';
export interface Props extends ScriptHTMLAttributes<HTMLScriptElement> {
    strategy?: 'afterInteractive' | 'lazyOnload' | 'beforeInteractive';
    id?: string;
    onLoad?: () => void;
    onError?: () => void;
    children?: React.ReactNode;
}
export declare function initScriptLoader(scriptLoaderItems: Props[]): void;
declare function Script(props: Props): JSX.Element | null;
export default Script;
