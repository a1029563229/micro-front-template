import _uniq from "lodash/uniq";
import { __read, __spread } from "tslib";
/**
 * @author Kuitos
 * @since 2020-3-31
 */

import { getProxyPropertyGetter, getTargetValue } from './common';
import { clearSystemJsProps, interceptSystemJsProps } from './noise/systemjs'; // zone.js will overwrite Object.defineProperty

var rawObjectDefineProperty = Object.defineProperty;

function createFakeWindow(global) {
  var fakeWindow = {};
  /*
   copy the non-configurable property of global to fakeWindow
   see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getOwnPropertyDescriptor
   > A property cannot be reported as non-configurable, if it does not exists as an own property of the target object or if it exists as a configurable own property of the target object.
   */

  Object.getOwnPropertyNames(global).filter(function (p) {
    var descriptor = Object.getOwnPropertyDescriptor(global, p);
    return !(descriptor === null || descriptor === void 0 ? void 0 : descriptor.configurable);
  }).forEach(function (p) {
    var descriptor = Object.getOwnPropertyDescriptor(global, p);

    if (descriptor) {
      /*
       make top/self/window property configurable and writable, otherwise it will cause TypeError while get trap return.
       see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/get
       > The value reported for a property must be the same as the value of the corresponding target object property if the target object property is a non-writable, non-configurable data property.
       */
      if (p === 'top' || p === 'self' || p === 'window') {
        descriptor.configurable = true;
        descriptor.writable = true;
      } // just for test


      if (process.env.NODE_ENV === 'test' && p === 'mockTop') {
        descriptor.configurable = true;
        descriptor.writable = true;
      } // freeze the descriptor to avoid being modified by zone.js
      // see https://github.com/angular/zone.js/blob/a5fe09b0fac27ac5df1fa746042f96f05ccb6a00/lib/browser/define-property.ts#L71


      rawObjectDefineProperty(fakeWindow, p, Object.freeze(descriptor));
    }
  });
  return fakeWindow;
}

var activeSandboxCount = 0;
/**
 * 基于 Proxy 实现的沙箱
 */

var ProxySandbox =
/** @class */
function () {
  function ProxySandbox(name) {
    /** window 值变更的记录快照 */
    this.updateValueMap = new Map();
    this.sandboxRunning = true;
    this.name = name;

    var _a = this,
        sandboxRunning = _a.sandboxRunning,
        updateValueMap = _a.updateValueMap; // https://github.com/umijs/qiankun/pull/192


    var rawWindow = window;
    var fakeWindow = createFakeWindow(rawWindow);
    var proxy = new Proxy(fakeWindow, {
      set: function set(_, p, value) {
        if (sandboxRunning) {
          updateValueMap.set(p, value);
          interceptSystemJsProps(p, value);
          return true;
        }

        if (process.env.NODE_ENV === 'development') {
          console.warn("[qiankun] Set window." + p.toString() + " while sandbox destroyed or inactive in " + name + "!");
        } // 在 strict-mode 下，Proxy 的 handler.set 返回 false 会抛出 TypeError，在沙箱卸载的情况下应该忽略错误


        return true;
      },
      get: function get(_, p) {
        // just for test
        if (process.env.NODE_ENV === 'test' && p === 'mockTop') {
          return proxy;
        } // avoid who using window.window or window.self to escape the sandbox environment to touch the really window
        // or use window.top to check if an iframe context
        // see https://github.com/eligrey/FileSaver.js/blob/master/src/FileSaver.js#L13


        if (p === 'top' || p === 'window' || p === 'self') {
          return proxy;
        } // never rewrite eval


        if (p === 'eval') {
          // eslint-disable-next-line no-eval
          return eval;
        } // proxy.hasOwnProperty would invoke getter firstly, then its value represented as rawWindow.hasOwnProperty


        if (p === 'hasOwnProperty') {
          return function (key) {
            return updateValueMap.has(key) || rawWindow.hasOwnProperty(key);
          };
        } // call proxy getter interceptors


        var proxyPropertyGetter = getProxyPropertyGetter(proxy, p);

        if (proxyPropertyGetter) {
          return proxyPropertyGetter();
        } // Take priority from the updateValueMap, or fallback to window


        var value = updateValueMap.get(p) || rawWindow[p];
        return getTargetValue(rawWindow, value);
      },
      // trap in operator
      // see https://github.com/styled-components/styled-components/blob/master/packages/styled-components/src/constants.js#L12
      has: function has(_, p) {
        return updateValueMap.has(p) || p in rawWindow;
      },
      getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, p) {
        if (updateValueMap.has(p)) {
          // if the property is existed on raw window, use it original descriptor
          var descriptor = Object.getOwnPropertyDescriptor(rawWindow, p);

          if (descriptor) {
            return descriptor;
          }

          return {
            configurable: true,
            enumerable: true,
            writable: true,
            value: updateValueMap.get(p)
          };
        }
        /*
         as the descriptor of top/self/window/mockTop in raw window are configurable but not in proxy target, we need to get it from target to avoid TypeError
         see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getOwnPropertyDescriptor
         > A property cannot be reported as non-configurable, if it does not exists as an own property of the target object or if it exists as a configurable own property of the target object.
         */


        if (target.hasOwnProperty(p)) {
          return Object.getOwnPropertyDescriptor(target, p);
        }

        if (rawWindow.hasOwnProperty(p)) {
          return Object.getOwnPropertyDescriptor(rawWindow, p);
        }

        return undefined;
      },
      // trap to support iterator with sandbox
      ownKeys: function ownKeys() {
        return _uniq(__spread(Reflect.ownKeys(rawWindow), updateValueMap.keys()));
      },
      deleteProperty: function deleteProperty(_, p) {
        if (updateValueMap.has(p)) {
          updateValueMap.delete(p);
          return true;
        }

        return true;
      }
    });
    this.proxy = proxy;
  }

  ProxySandbox.prototype.active = function () {
    this.sandboxRunning = true;
    activeSandboxCount++;
  };

  ProxySandbox.prototype.inactive = function () {
    if (process.env.NODE_ENV === 'development') {
      console.info("[qiankun:sandbox] " + this.name + " modified global properties restore...", __spread(this.updateValueMap.keys()));
    }

    clearSystemJsProps(this.updateValueMap, --activeSandboxCount === 0);
    this.sandboxRunning = false;
  };

  return ProxySandbox;
}();

export default ProxySandbox;