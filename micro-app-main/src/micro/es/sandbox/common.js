/**
 * @author Kuitos
 * @since 2020-04-13
 */
import { __assign } from "tslib";
import { isConstructable } from '../utils';
var boundValueSymbol = Symbol('bound value');
export function getTargetValue(target, value) {
  /*
    仅绑定 !isConstructable && isCallable 的函数对象，如 window.console、window.atob 这类。目前没有完美的检测方式，这里通过 prototype 中是否还有可枚举的拓展方法的方式来判断
    @warning 这里不要随意替换成别的判断方式，因为可能触发一些 edge case（比如在 lodash.isFunction 在 iframe 上下文中可能由于调用了 top window 对象触发的安全异常）
   */
  if (typeof value === 'function' && !isConstructable(value)) {
    if (value[boundValueSymbol]) {
      return value[boundValueSymbol];
    }

    var boundValue_1 = value.bind(target); // some callable function has custom fields, we need to copy the enumerable props to boundValue. such as moment function.

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
}
var proxyGetterMap = new Map();
export function getProxyPropertyGetter(proxy, property) {
  var getters = proxyGetterMap.get(proxy) || {};
  return getters[property];
}
export function setProxyPropertyGetter(proxy, property, getter) {
  var _a;

  var prevGetters = proxyGetterMap.get(proxy) || {};
  proxyGetterMap.set(proxy, __assign(__assign({}, prevGetters), (_a = {}, _a[property] = getter, _a)));
}