import _typeof from "@babel/runtime/helpers/esm/typeof";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _isFunction from "lodash/isFunction";
import _snakeCase from "lodash/snakeCase";
export function toArray(array) {
  return Array.isArray(array) ? array : [array];
}
export function sleep(ms) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, ms);
  });
}
export function isConstructable(fn) {
  var constructableFunctionRegex = /^function\b\s[A-Z].*/;
  var classRegex = /^class\b/; // 有 prototype 并且 prototype 上有定义一系列非 constructor 属性，则可以认为是一个构造函数

  return fn.prototype && fn.prototype.constructor === fn && Object.getOwnPropertyNames(fn.prototype).length > 1 || constructableFunctionRegex.test(fn.toString()) || classRegex.test(fn.toString());
}
/**
 * in safari
 * typeof document.all === 'undefined' // true
 * typeof document.all === 'function' // true
 * We need to discriminate safari for better performance
 */

var naughtySafari = typeof document.all === 'function' && typeof document.all === 'undefined';
export var isCallable = naughtySafari ? function (fn) {
  return typeof fn === 'function' && typeof fn !== 'undefined';
} : function (fn) {
  return typeof fn === 'function';
};
export function isBoundedFunction(fn) {
  /*
   indexOf is faster than startsWith
   see https://jsperf.com/string-startswith/72
   */
  return fn.name.indexOf('bound ') === 0 && !fn.hasOwnProperty('prototype');
}
/**
 * fastest(at most time) unique array method
 * @see https://jsperf.com/array-filter-unique/30
 */

export function uniq(array) {
  return array.filter(function filter(element) {
    return element in this ? false : this[element] = true;
  }, {});
}
export function getDefaultTplWrapper(id, name) {
  return function (tpl) {
    return "<div id=\"".concat(getWrapperId(id), "\" data-name=\"").concat(name, "\">").concat(tpl, "</div>");
  };
}
export function getWrapperId(id) {
  return "__qiankun_microapp_wrapper_for_".concat(_snakeCase(id), "__");
}
/** 校验子应用导出的 生命周期 对象是否正确 */

export function validateExportLifecycle(exports) {
  var _ref = exports !== null && exports !== void 0 ? exports : {},
      bootstrap = _ref.bootstrap,
      mount = _ref.mount,
      unmount = _ref.unmount;

  return _isFunction(bootstrap) && _isFunction(mount) && _isFunction(unmount);
}

var Deferred = function Deferred() {
  var _this = this;

  _classCallCheck(this, Deferred);

  this.promise = new Promise(function (resolve, reject) {
    _this.resolve = resolve;
    _this.reject = reject;
  });
};

export { Deferred };
var supportsUserTiming = typeof performance !== 'undefined' && typeof performance.mark === 'function' && typeof performance.clearMarks === 'function' && typeof performance.measure === 'function' && typeof performance.clearMeasures === 'function';
export function performanceMark(markName) {
  if (supportsUserTiming) {
    performance.mark(markName);
  }
}
export function performanceMeasure(measureName, markName) {
  if (supportsUserTiming) {
    performance.measure(measureName, markName);
    performance.clearMarks(markName);
    performance.clearMeasures(measureName);
  }
}
export function isEnableScopedCSS(opt) {
  if (_typeof(opt.sandbox) !== 'object') {
    return false;
  }

  if (opt.sandbox.strictStyleIsolation) {
    return false;
  }

  return !!opt.sandbox.experimentalStyleIsolation;
}