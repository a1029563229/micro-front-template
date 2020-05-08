import _noop from "lodash/noop";

/**
 * @author Kuitos
 * @since 2019-04-11
 */
import { __read, __spread } from "tslib";
var rawAddEventListener = window.addEventListener;
var rawRemoveEventListener = window.removeEventListener;
export default function patch() {
  var listenerMap = new Map();

  window.addEventListener = function (type, listener, options) {
    var listeners = listenerMap.get(type) || [];
    listenerMap.set(type, __spread(listeners, [listener]));
    return rawAddEventListener.call(window, type, listener, options);
  };

  window.removeEventListener = function (type, listener, options) {
    var storedTypeListeners = listenerMap.get(type);

    if (storedTypeListeners && storedTypeListeners.length && storedTypeListeners.indexOf(listener) !== -1) {
      storedTypeListeners.splice(storedTypeListeners.indexOf(listener), 1);
    }

    return rawRemoveEventListener.call(window, type, listener, options);
  };

  return function free() {
    listenerMap.forEach(function (listeners, type) {
      return __spread(listeners).forEach(function (listener) {
        return window.removeEventListener(type, listener);
      });
    });
    window.addEventListener = rawAddEventListener;
    window.removeEventListener = rawRemoveEventListener;
    return _noop;
  };
}