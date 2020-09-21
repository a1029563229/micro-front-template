import _noop from "lodash/noop";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _createSuper from "@babel/runtime/helpers/esm/createSuper";
var RawMouseEvent = window.MouseEvent;
export default function patch(global) {
  // if ts compile target is es5, the native super/extends has some problems
  // see: https://github.com/microsoft/TypeScript/wiki/FAQ#why-doesnt-extending-built-ins-like-error-array-and-map-work
  var FakeMouseEvent = /*#__PURE__*/function (_RawMouseEvent) {
    _inherits(FakeMouseEvent, _RawMouseEvent);

    var _super = _createSuper(FakeMouseEvent);

    function FakeMouseEvent(typeArg, mouseEventInit) {
      _classCallCheck(this, FakeMouseEvent);

      var _a; // if UIEvent want to window view, we should replace ProxyWindow with Window


      if (mouseEventInit && ((_a = mouseEventInit.view) === null || _a === void 0 ? void 0 : _a.top) === mouseEventInit.view) {
        // resolve: https://github.com/umijs/qiankun/issues/570
        // eg: https://github.com/apache/incubator-echarts/blob/master/src/component/toolbox/feature/SaveAsImage.js#L63...L75
        // eslint-disable-next-line no-param-reassign
        mouseEventInit.view = window;
      }

      return _super.call(this, typeArg, mouseEventInit);
    }

    return FakeMouseEvent;
  }(RawMouseEvent); // eslint-disable-next-line no-param-reassign


  global.MouseEvent = FakeMouseEvent;
  return function free() {
    // eslint-disable-next-line no-param-reassign
    global.MouseEvent = RawMouseEvent;
    return _noop;
  };
}