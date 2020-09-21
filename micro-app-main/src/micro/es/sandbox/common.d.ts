/**
 * @author Kuitos
 * @since 2020-04-13
 */
export declare const attachDocProxySymbol: unique symbol;
declare global {
    interface Document {
        [attachDocProxySymbol]: WindowProxy;
    }
}
export declare function getTargetValue(target: any, value: any): any;
export declare function getProxyPropertyValue(getter: CallableFunction): any;
