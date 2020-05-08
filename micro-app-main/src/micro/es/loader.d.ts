/**
 * @author Kuitos
 * @since 2020-04-01
 */
import { ParcelConfigObject } from 'single-spa';
import { FrameworkConfiguration, FrameworkLifeCycles, LoadableApp } from './interfaces';
export declare function loadApp<T extends object>(app: LoadableApp<T>, configuration?: FrameworkConfiguration, lifeCycles?: FrameworkLifeCycles<T>): Promise<ParcelConfigObject>;
