/**
 * @author Kuitos
 * @since 2019-05-15
 */
export declare function sleep(ms: number): Promise<unknown>;
export declare function isConstructable(fn: () => void | FunctionConstructor): number | boolean;
export declare function getDefaultTplWrapper(id: string): (tpl: string) => string;
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
