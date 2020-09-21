/**
 * @author howel52
 * @since 2020-05-13
 */
declare global {
    interface Window {
        MouseEvent: MouseEvent;
    }
}
export default function patch(global: Window): () => (...args: any[]) => void;
