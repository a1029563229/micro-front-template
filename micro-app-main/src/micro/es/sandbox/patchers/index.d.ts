/**
 * @author Kuitos
 * @since 2019-04-11
 */
import { Freer, SandBox } from '../../interfaces';
import * as css from './css';
export declare function patchAtMounting(appName: string, elementGetter: () => HTMLElement | ShadowRoot, sandbox: SandBox, singular: boolean, scopedCSS: boolean, excludeAssetFilter?: Function): Freer[];
export declare function patchAtBootstrapping(appName: string, elementGetter: () => HTMLElement | ShadowRoot, sandbox: SandBox, singular: boolean, scopedCSS: boolean, excludeAssetFilter?: Function): Freer[];
export { css };
