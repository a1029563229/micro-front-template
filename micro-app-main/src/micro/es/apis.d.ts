import { FrameworkConfiguration, FrameworkLifeCycles, LoadableApp, MicroApp, RegistrableApp } from './interfaces';
export declare let frameworkConfiguration: FrameworkConfiguration;
export declare function registerMicroApps<T extends object = {}>(apps: Array<RegistrableApp<T>>, lifeCycles?: FrameworkLifeCycles<T>): void;
export declare function loadMicroApp<T extends object = {}>(app: LoadableApp<T>, configuration?: FrameworkConfiguration): MicroApp;
export declare function start(opts?: FrameworkConfiguration): void;
