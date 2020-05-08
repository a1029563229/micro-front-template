import _typeof from "@babel/runtime/helpers/esm/typeof";
import { __read, __spread } from "tslib";
import { isConstructable } from '../../utils';

function isPropConfigurable(target, prop) {
  var descriptor = Object.getOwnPropertyDescriptor(target, prop);
  return descriptor ? descriptor.configurable : true;
}

function setWindowProp(prop, value, toDelete) {
  if (value === undefined && toDelete) {
    delete window[prop];
  } else if (isPropConfigurable(window, prop) && _typeof(prop) !== 'symbol') {
    Object.defineProperty(window, prop, {
      writable: true,
      configurable: true
    });
    window[prop] = value;
  }
}
/**
 * 基于 Proxy 实现的沙箱
 * TODO: 为了兼容性 singular 模式下依旧使用该沙箱，等新沙箱稳定之后再切换
 */


var SingularProxySandbox =
/** @class */
function () {
  function SingularProxySandbox(name) {
    /** 沙箱期间新增的全局变量 */
    this.addedPropsMapInSandbox = new Map();
    /** 沙箱期间更新的全局变量 */

    this.modifiedPropsOriginalValueMapInSandbox = new Map();
    /** 持续记录更新的(新增和修改的)全局变量的 map，用于在任意时刻做 snapshot */

    this.currentUpdatedPropsValueMap = new Map();
    this.sandboxRunning = true;
    this.name = name;

    var _a = this,
        sandboxRunning = _a.sandboxRunning,
        addedPropsMapInSandbox = _a.addedPropsMapInSandbox,
        modifiedPropsOriginalValueMapInSandbox = _a.modifiedPropsOriginalValueMapInSandbox,
        currentUpdatedPropsValueMap = _a.currentUpdatedPropsValueMap;

    var boundValueSymbol = Symbol('bound value');
    var rawWindow = window;
    var fakeWindow = Object.create(null);
    var proxy = new Proxy(fakeWindow, {
      set: function set(_, p, value) {
        if (sandboxRunning) {
          if (!rawWindow.hasOwnProperty(p)) {
            addedPropsMapInSandbox.set(p, value);
          } else if (!modifiedPropsOriginalValueMapInSandbox.has(p)) {
            // 如果当前 window 对象存在该属性，且 record map 中未记录过，则记录该属性初始值
            var originalValue = rawWindow[p];
            modifiedPropsOriginalValueMapInSandbox.set(p, originalValue);
          }

          currentUpdatedPropsValueMap.set(p, value); // 必须重新设置 window 对象保证下次 get 时能拿到已更新的数据
          // eslint-disable-next-line no-param-reassign

          rawWindow[p] = value;
          return true;
        }

        if (process.env.NODE_ENV === 'development') {
          console.warn("[qiankun] Set window." + p.toString() + " while sandbox destroyed or inactive in " + name + "!");
        } // 在 strict-mode 下，Proxy 的 handler.set 返回 false 会抛出 TypeError，在沙箱卸载的情况下应该忽略错误


        return true;
      },
      get: function get(_, p) {
        // avoid who using window.window or window.self to escape the sandbox environment to touch the really window
        // or use window.top to check if an iframe context
        // see https://github.com/eligrey/FileSaver.js/blob/master/src/FileSaver.js#L13
        if (p === 'top' || p === 'window' || p === 'self') {
          return proxy;
        }

        var value = rawWindow[p];
        /*
        仅绑定 !isConstructable && isCallable 的函数对象，如 window.console、window.atob 这类。目前没有完美的检测方式，这里通过 prototype 中是否还有可枚举的拓展方法的方式来判断
        @warning 这里不要随意替换成别的判断方式，因为可能触发一些 edge case（比如在 lodash.isFunction 在 iframe 上下文中可能由于调用了 top window 对象触发的安全异常）
         */

        if (typeof value === 'function' && !isConstructable(value)) {
          if (value[boundValueSymbol]) {
            return value[boundValueSymbol];
          }

          var boundValue_1 = value.bind(rawWindow); // some callable function has custom fields, we need to copy the enumerable props to boundValue. such as moment function.

          Object.keys(value).forEach(function (key) {
            return boundValue_1[key] = value[key];
          });
          Object.defineProperty(value, boundValueSymbol, {
            enumerable: false,
            value: boundValue_1
          });
          return boundValue_1;
        }

        return value;
      },
      // trap in operator
      // see https://github.com/styled-components/styled-components/blob/master/packages/styled-components/src/constants.js#L12
      has: function has(_, p) {
        return p in rawWindow;
      }
    });
    this.proxy = proxy;
  }

  SingularProxySandbox.prototype.active = function () {
    if (!this.sandboxRunning) {
      this.currentUpdatedPropsValueMap.forEach(function (v, p) {
        return setWindowProp(p, v);
      });
    }

    this.sandboxRunning = true;
  };

  SingularProxySandbox.prototype.inactive = function () {
    if (process.env.NODE_ENV === 'development') {
      console.info("[qiankun:sandbox] " + this.name + " modified global properties restore...", __spread(this.addedPropsMapInSandbox.keys(), this.modifiedPropsOriginalValueMapInSandbox.keys()));
    } // renderSandboxSnapshot = snapshot(currentUpdatedPropsValueMapForSnapshot);
    // restore global props to initial snapshot


    this.modifiedPropsOriginalValueMapInSandbox.forEach(function (v, p) {
      return setWindowProp(p, v);
    });
    this.addedPropsMapInSandbox.forEach(function (_, p) {
      return setWindowProp(p, undefined, true);
    });
    this.sandboxRunning = false;
  };

  return SingularProxySandbox;
}();

export default SingularProxySandbox;