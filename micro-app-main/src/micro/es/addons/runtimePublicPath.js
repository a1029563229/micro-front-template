import { __awaiter, __generator } from "tslib";
var rawPublicPath = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ || '/';
export default function getAddOn(global, publicPath) {
  if (publicPath === void 0) {
    publicPath = '/';
  }

  var hasMountedOnce = false;
  return {
    beforeLoad: function beforeLoad() {
      return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          // eslint-disable-next-line no-param-reassign
          global.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ = publicPath;
          return [2
          /*return*/
          ];
        });
      });
    },
    beforeMount: function beforeMount() {
      return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          if (hasMountedOnce) {
            // eslint-disable-next-line no-param-reassign
            global.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ = publicPath;
          }

          return [2
          /*return*/
          ];
        });
      });
    },
    beforeUnmount: function beforeUnmount() {
      return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          if (rawPublicPath === undefined) {
            // eslint-disable-next-line no-param-reassign
            delete global.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
          } else {
            // eslint-disable-next-line no-param-reassign
            global.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ = rawPublicPath;
          }

          hasMountedOnce = true;
          return [2
          /*return*/
          ];
        });
      });
    }
  };
}