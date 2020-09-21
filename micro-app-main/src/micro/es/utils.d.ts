/**
 * @author Kuitos
 * @since 2019-05-15
 */
import { FrameworkConfiguration } from './interfaces';
export declare function toArray<T>(array: T | T[]): T[];
export declare function sleep(ms: number): Promise<unknown>;
export declare function isConstructable(fn: () => void | FunctionConstructor): boolean;
export declare const isCallable: (fn: any) => boolean;
export declare function isBoundedFunction(fn: CallableFunction): boolean;
/**
 * fastest(at most time) unique array method
 * @see https://jsperf.com/array-filter-unique/30
 */
export declare function uniq(array: PropertyKey[]): (string | number | symbol)[];
export declare function getDefaultTplWrapper(id: string, name: string): (tpl: string) => string;
export declare function getWrapperId(id: string): string;
/** 校验子应用导出的 生命周期 对象是否正确 */
export declare function validateExportLifecycle(exports: any): boolean;
declare class Deferred<T> {
    promise: Promise<T>;
    resolve: (value?: T | PromiseLike<T>) => void;
    reject: (reason?: any) => void;
    constructor();
}
export { Deferred };
export declare function performanceMark(markName: string): void;
export declare function performanceMeasure(measureName: string, markName: string): void;
export declare function isEnableScopedCSS(opt: FrameworkConfiguration): boolean;
