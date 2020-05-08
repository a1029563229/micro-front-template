/**
 * @author Kuitos
 * @since 2020-03-02
 */
import { FrameworkLifeCycles } from '../interfaces';
export default function getAddOns<T extends object>(global: Window, publicPath: string): FrameworkLifeCycles<T>;
