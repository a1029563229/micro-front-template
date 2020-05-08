function iter(obj, callbackFn) {
  // eslint-disable-next-line guard-for-in, no-restricted-syntax
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      callbackFn(prop);
    }
  }
}
/**
 * 基于 diff 方式实现的沙箱，用于不支持 Proxy 的低版本浏览器
 */


var SnapshotSandbox =
/** @class */
function () {
  function SnapshotSandbox(name) {
    this.sandboxRunning = false;
    this.modifyPropsMap = {};
    this.name = name;
    this.proxy = window;
    this.active();
  }

  SnapshotSandbox.prototype.active = function () {
    var _this = this;

    if (this.sandboxRunning) {
      return;
    } // 记录当前快照


    this.windowSnapshot = {};
    iter(window, function (prop) {
      _this.windowSnapshot[prop] = window[prop];
    }); // 恢复之前的变更

    Object.keys(this.modifyPropsMap).forEach(function (p) {
      window[p] = _this.modifyPropsMap[p];
    });
    this.sandboxRunning = true;
  };

  SnapshotSandbox.prototype.inactive = function () {
    var _this = this;

    this.modifyPropsMap = {};
    iter(window, function (prop) {
      if (window[prop] !== _this.windowSnapshot[prop]) {
        // 记录变更，恢复环境
        _this.modifyPropsMap[prop] = window[prop];
        window[prop] = _this.windowSnapshot[prop];
      }
    });

    if (process.env.NODE_ENV === 'development') {
      console.info("[qiankun:sandbox] " + this.name + " origin window restore...", Object.keys(this.modifyPropsMap));
    }

    this.sandboxRunning = false;
  };

  return SnapshotSandbox;
}();

export default SnapshotSandbox;