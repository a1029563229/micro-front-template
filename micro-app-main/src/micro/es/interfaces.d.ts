/**
 * @author kuitos
 * @since 2019-05-16
 */
import { ImportEntryOpts } from 'import-html-entry';
import { RegisterApplicationConfig, StartOpts, Parcel } from 'single-spa';
declare global {
    interface Window {
        __POWERED_BY_QIANKUN__?: boolean;
        __INJECTED_PUBLIC_PATH_BY_QIANKUN__?: string;
    }
}
export declare type Entry = string | {
    scripts?: string[];
    styles?: string[];
    html?: string;
};
export declare type HTMLContentRender = (props: {
    appContent: string;
    loading: boolean;
}) => any;
export declare type AppMetadata = {
    name: string;
    entry: Entry;
};
export declare type LoadableApp<T extends object = {}> = AppMetadata & {
    props?: T;
} & ({
    render: HTMLContentRender;
} | {
    container: string | HTMLElement;
});
export declare type RegistrableApp<T extends object = {}> = LoadableApp<T> & {
    activeRule: RegisterApplicationConfig['activeWhen'];
};
export declare type PrefetchStrategy = boolean | 'all' | string[] | ((apps: AppMetadata[]) => {
    criticalAppNames: string[];
    minorAppsName: string[];
});
declare type QiankunSpecialOpts = {
    prefetch?: PrefetchStrategy;
    sandbox?: boolean | {
        strictStyleIsolation?: boolean;
        patchers?: Patcher[];
    };
    singular?: boolean | ((app: LoadableApp<any>) => Promise<boolean>);
};
export declare type FrameworkConfiguration = QiankunSpecialOpts & ImportEntryOpts & StartOpts;
export declare type LifeCycleFn<T extends object> = (app: LoadableApp<T>) => Promise<any>;
export declare type FrameworkLifeCycles<T extends object> = {
    beforeLoad?: LifeCycleFn<T> | Array<LifeCycleFn<T>>;
    beforeMount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>;
    afterMount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>;
    beforeUnmount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>;
    afterUnmount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>;
};
export declare type MicroApp = Parcel;
export declare type Rebuilder = () => void;
export declare type Freer = () => Rebuilder;
export declare type Patcher = () => Freer;
export interface SandBox {
    /** 沙箱的名字 */
    name: string;
    /** 沙箱导出的代理实体 */
    proxy: WindowProxy;
    /** 沙箱是否在运行中 */
    sandboxRunning: boolean;
    /** 启动沙箱 */
    active(): void;
    /** 关闭沙箱 */
    inactive(): void;
}
export declare type OnGlobalStateChangeCallback = (state: Record<string, any>, prevState: Record<string, any>) => void;
export declare type MicroAppStateActions = {
    onGlobalStateChange: (callback: OnGlobalStateChangeCallback, fireImmediately?: boolean) => void;
    setGlobalState: (state: Record<string, any>) => boolean;
    offGlobalStateChange: () => boolean;
};
export {};
