import _isFunction from "lodash/isFunction";

/**
 * @author Kuitos
 * @since 2019-02-26
 */
import { __awaiter, __generator } from "tslib";
import { importEntry } from 'import-html-entry';
import { getMountedApps } from 'single-spa'; // RIC and shim for browsers setTimeout() without it

var requestIdleCallback = window.requestIdleCallback || function requestIdleCallback(cb) {
  var start = Date.now();
  return setTimeout(function () {
    cb({
      didTimeout: false,
      timeRemaining: function timeRemaining() {
        return Math.max(0, 50 - (Date.now() - start));
      }
    });
  }, 1);
}; // https://stackoverflow.com/questions/3514784/what-is-the-best-way-to-detect-a-mobile-device


var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
var isSlowNetwork = navigator.connection ? navigator.connection.saveData || /(2|3)g/.test(navigator.connection.effectiveType) : false;
/**
 * prefetch assets, do nothing while in mobile network
 * @param entry
 * @param opts
 */

function prefetch(entry, opts) {
  var _this = this;

  if (isMobile || isSlowNetwork) {
    // Don't prefetch if an mobile device or in a slow network.
    return;
  }

  requestIdleCallback(function () {
    return __awaiter(_this, void 0, void 0, function () {
      var _a, getExternalScripts, getExternalStyleSheets;

      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            return [4
            /*yield*/
            , importEntry(entry, opts)];

          case 1:
            _a = _b.sent(), getExternalScripts = _a.getExternalScripts, getExternalStyleSheets = _a.getExternalStyleSheets;
            requestIdleCallback(getExternalStyleSheets);
            requestIdleCallback(getExternalScripts);
            return [2
            /*return*/
            ];
        }
      });
    });
  });
}

function prefetchAfterFirstMounted(apps, opts) {
  window.addEventListener('single-spa:first-mount', function listener() {
    var mountedApps = getMountedApps();
    var notMountedApps = apps.filter(function (app) {
      return mountedApps.indexOf(app.name) === -1;
    });

    if (process.env.NODE_ENV === 'development') {
      console.log("[qiankun] prefetch starting after " + mountedApps + " mounted...", notMountedApps);
    }

    notMountedApps.forEach(function (_a) {
      var entry = _a.entry;
      return prefetch(entry, opts);
    });
    window.removeEventListener('single-spa:first-mount', listener);
  });
}

export function prefetchImmediately(apps, opts) {
  if (process.env.NODE_ENV === 'development') {
    console.log('[qiankun] prefetch starting for apps...', apps);
  }

  apps.forEach(function (_a) {
    var entry = _a.entry;
    return prefetch(entry, opts);
  });
}
export function doPrefetchStrategy(apps, prefetchStrategy, importEntryOpts) {
  var _this = this;

  var appsName2Apps = function appsName2Apps(names) {
    return apps.filter(function (app) {
      return names.includes(app.name);
    });
  };

  if (Array.isArray(prefetchStrategy)) {
    prefetchAfterFirstMounted(appsName2Apps(prefetchStrategy), importEntryOpts);
  } else if (_isFunction(prefetchStrategy)) {
    (function () {
      return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, criticalAppNames, _c, minorAppsName;

        return __generator(this, function (_d) {
          switch (_d.label) {
            case 0:
              return [4
              /*yield*/
              , prefetchStrategy(apps)];

            case 1:
              _a = _d.sent(), _b = _a.criticalAppNames, criticalAppNames = _b === void 0 ? [] : _b, _c = _a.minorAppsName, minorAppsName = _c === void 0 ? [] : _c;
              prefetchImmediately(appsName2Apps(criticalAppNames), importEntryOpts);
              prefetchAfterFirstMounted(appsName2Apps(minorAppsName), importEntryOpts);
              return [2
              /*return*/
              ];
          }
        });
      });
    })();
  } else {
    switch (prefetchStrategy) {
      case true:
        prefetchAfterFirstMounted(apps, importEntryOpts);
        break;

      case 'all':
        prefetchImmediately(apps, importEntryOpts);
        break;

      default:
        break;
    }
  }
}