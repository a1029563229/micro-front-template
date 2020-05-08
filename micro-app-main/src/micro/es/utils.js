import _isFunction from "lodash/isFunction";
import _snakeCase from "lodash/snakeCase";
export function sleep(ms) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, ms);
  });
}
export function isConstructable(fn) {
  var constructableFunctionRegex = /^function\b\s[A-Z].*/;
  var classRegex = /^class\b/; // 有 prototype 并且 prototype 上有定义一系列非 constructor 属性，则可以认为是一个构造函数

  return fn.prototype && Object.getOwnPropertyNames(fn.prototype).filter(function (k) {
    return k !== 'constructor';
  }).length || constructableFunctionRegex.test(fn.toString()) || classRegex.test(fn.toString());
}
export function getDefaultTplWrapper(id) {
  return function (tpl) {
    return "<div id=\"" + getWrapperId(id) + "\">" + tpl + "</div>";
  };
}
export function getWrapperId(id) {
  return "__qiankun_microapp_wrapper_for_" + _snakeCase(id) + "__";
}
/** 校验子应用导出的 生命周期 对象是否正确 */

export function validateExportLifecycle(exports) {
  var _a = exports !== null && exports !== void 0 ? exports : {},
      bootstrap = _a.bootstrap,
      mount = _a.mount,
      unmount = _a.unmount;

  return _isFunction(bootstrap) && _isFunction(mount) && _isFunction(unmount);
}

var Deferred =
/** @class */
function () {
  function Deferred() {
    var _this = this;

    this.promise = new Promise(function (resolve, reject) {
      _this.resolve = resolve;
      _this.reject = reject;
    });
  }

  return Deferred;
}();

export { Deferred };