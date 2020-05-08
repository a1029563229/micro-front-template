import { SandBox } from '../interfaces';
/**
 * 基于 Proxy 实现的沙箱
 */
export default class ProxySandbox implements SandBox {
    /** window 值变更的记录快照 */
    private updateValueMap;
    name: string;
    proxy: WindowProxy;
    sandboxRunning: boolean;
    active(): void;
    inactive(): void;
    constructor(name: string);
}
