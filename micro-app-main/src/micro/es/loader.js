import _concat from "lodash/concat";
import _mergeWith from "lodash/mergeWith";
import _typeof from "@babel/runtime/helpers/esm/typeof";

/**
 * @author Kuitos
 * @since 2020-04-01
 */
import { __assign, __awaiter, __generator, __rest } from "tslib";
import { importEntry } from 'import-html-entry';
import getAddOns from './addons';
import { getMicroAppStateActions } from './globalState';
import { createSandbox } from './sandbox';
import { Deferred, getDefaultTplWrapper, getWrapperId, validateExportLifecycle } from './utils';

function assertElementExist(element, msg) {
  if (!element) {
    if (msg) {
      throw new Error(msg);
    }

    throw new Error('[qiankun] element not existed!');
  }
}

function toArray(array) {
  return Array.isArray(array) ? array : [array];
}

function execHooksChain(hooks, app) {
  if (hooks.length) {
    return hooks.reduce(function (chain, hook) {
      return chain.then(function () {
        return hook(app);
      });
    }, Promise.resolve());
  }

  return Promise.resolve();
}

function validateSingularMode(validate, app) {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      return [2
      /*return*/
      , typeof validate === 'function' ? validate(app) : !!validate];
    });
  });
} // @ts-ignore


var supportShadowDOM = document.head.attachShadow || document.head.createShadowRoot;

function createElement(appContent, strictStyleIsolation) {
  var containerElement = document.createElement('div');
  containerElement.innerHTML = appContent; // appContent always wrapped with a singular div

  var appElement = containerElement.firstChild;

  if (strictStyleIsolation) {
    if (!supportShadowDOM) {
      console.warn('[qiankun]: As current browser not support shadow dom, your strictStyleIsolation configuration will be ignored!');
    } else {
      var innerHTML = appElement.innerHTML;
      appElement.innerHTML = '';
      var shadow = appElement.attachShadow({
        mode: 'open'
      });
      shadow.innerHTML = innerHTML;
    }
  }

  return appElement;
}
/** generate app wrapper dom getter */


function getAppWrapperGetter(appName, appInstanceId, useLegacyRender, strictStyleIsolation, elementGetter) {
  return function () {
    if (useLegacyRender) {
      if (strictStyleIsolation) throw new Error('[qiankun]: strictStyleIsolation can not be used with legacy render!');
      var appWrapper = document.getElementById(getWrapperId(appInstanceId));
      assertElementExist(appWrapper, "[qiankun] Wrapper element for " + appName + " with instance " + appInstanceId + " is not existed!");
      return appWrapper;
    }

    var element = elementGetter();
    assertElementExist(element, "[qiankun] Wrapper element for " + appName + " with instance " + appInstanceId + " is not existed!");

    if (strictStyleIsolation) {
      return element.shadowRoot;
    }

    return element;
  };
}

var rawAppendChild = HTMLElement.prototype.appendChild;
var rawRemoveChild = HTMLElement.prototype.removeChild;
/**
 * Get the render function
 * If the legacy render function is provide, used as it, otherwise we will insert the app element to target container by qiankun
 * @param appName
 * @param appContent
 * @param container
 * @param legacyRender
 */

function getRender(appName, appContent, container, legacyRender) {
  var render = function render(_a, phase) {
    var element = _a.element,
        loading = _a.loading;

    if (legacyRender) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[qiankun] Custom rendering function is deprecated, you can use the container element setting instead!');
      }

      return legacyRender({
        loading: loading,
        appContent: element ? appContent : ''
      });
    }

    var containerElement = typeof container === 'string' ? document.querySelector(container) : container; // The container might have be removed after micro app unmounted.
    // Such as the micro app unmount lifecycle called by a react componentWillUnmount lifecycle, after micro app unmounted, the react component might also be removed

    if (phase !== 'unmounted') {
      var errorMsg = function () {
        switch (phase) {
          case 'loading':
          case 'mounting':
            return "[qiankun] Target container with " + container + " not existed while " + appName + " " + phase + "!";

          case 'mounted':
            return "[qiankun] Target container with " + container + " not existed after " + appName + " " + phase + "!";

          default:
            return "[qiankun] Target container with " + container + " not existed while " + appName + " rendering!";
        }
      }();

      assertElementExist(containerElement, errorMsg);
    }

    if (containerElement && !containerElement.contains(element)) {
      // clear the container
      while (containerElement.firstChild) {
        rawRemoveChild.call(containerElement, containerElement.firstChild);
      } // append the element to container if it exist


      if (element) {
        rawAppendChild.call(containerElement, element);
      }
    }

    return undefined;
  };

  return render;
}

function getLifecyclesFromExports(scriptExports, appName, global) {
  if (validateExportLifecycle(scriptExports)) {
    return scriptExports;
  }

  if (process.env.NODE_ENV === 'development') {
    console.warn("[qiankun] lifecycle not found from " + appName + " entry exports, fallback to get from window['" + appName + "']");
  } // fallback to global variable who named with ${appName} while module exports not found


  var globalVariableExports = global[appName];

  if (validateExportLifecycle(globalVariableExports)) {
    return globalVariableExports;
  }

  throw new Error("[qiankun] You need to export lifecycle functions in " + appName + " entry");
}

var prevAppUnmountedDeferred;
export function loadApp(app, configuration, lifeCycles) {
  if (configuration === void 0) {
    configuration = {};
  }

  return __awaiter(this, void 0, void 0, function () {
    var entry, appName, _a, singular, _b, sandbox, importEntryOpts, _c, template, execScripts, assetPublicPath, appInstanceId, strictStyleIsolation, appContent, element, container, legacyRender, render, containerGetter, global, mountSandbox, unmountSandbox, sandboxInstance, _d, _e, beforeUnmount, _f, afterUnmount, _g, afterMount, _h, beforeMount, _j, beforeLoad, scriptExports, _k, bootstrap, mount, unmount, update, _l, onGlobalStateChange, setGlobalState, offGlobalStateChange, parcelConfig;

    var _this = this;

    return __generator(this, function (_m) {
      switch (_m.label) {
        case 0:
          entry = app.entry, appName = app.name;
          _a = configuration.singular, singular = _a === void 0 ? false : _a, _b = configuration.sandbox, sandbox = _b === void 0 ? true : _b, importEntryOpts = __rest(configuration, ["singular", "sandbox"]);
          return [4
          /*yield*/
          , importEntry(entry, importEntryOpts)];

        case 1:
          _c = _m.sent(), template = _c.template, execScripts = _c.execScripts, assetPublicPath = _c.assetPublicPath;
          return [4
          /*yield*/
          , validateSingularMode(singular, app)];

        case 2:
          if (!_m.sent()) return [3
          /*break*/
          , 4];
          return [4
          /*yield*/
          , prevAppUnmountedDeferred && prevAppUnmountedDeferred.promise];

        case 3:
          _m.sent();

          _m.label = 4;

        case 4:
          appInstanceId = appName + "_" + +new Date();
          strictStyleIsolation = _typeof(sandbox) === 'object' && !!sandbox.strictStyleIsolation;
          appContent = getDefaultTplWrapper(appInstanceId)(template);
          element = createElement(appContent, strictStyleIsolation);
          container = 'container' in app ? app.container : undefined;
          legacyRender = 'render' in app ? app.render : undefined;
          render = getRender(appName, appContent, container, legacyRender); // 第一次加载设置应用可见区域 dom 结构
          // 确保每次应用加载前容器 dom 结构已经设置完毕

          render({
            element: element,
            loading: true
          }, 'loading');
          containerGetter = getAppWrapperGetter(appName, appInstanceId, !!legacyRender, strictStyleIsolation, function () {
            return element;
          });
          global = window;

          mountSandbox = function mountSandbox() {
            return Promise.resolve();
          };

          unmountSandbox = function unmountSandbox() {
            return Promise.resolve();
          };

          if (sandbox) {
            sandboxInstance = createSandbox(appName, containerGetter, Boolean(singular)); // 用沙箱的代理对象作为接下来使用的全局对象

            global = sandboxInstance.proxy;
            mountSandbox = sandboxInstance.mount;
            unmountSandbox = sandboxInstance.unmount;
          }

          _d = _mergeWith({}, getAddOns(global, assetPublicPath), lifeCycles, function (v1, v2) {
            return _concat(v1 !== null && v1 !== void 0 ? v1 : [], v2 !== null && v2 !== void 0 ? v2 : []);
          }), _e = _d.beforeUnmount, beforeUnmount = _e === void 0 ? [] : _e, _f = _d.afterUnmount, afterUnmount = _f === void 0 ? [] : _f, _g = _d.afterMount, afterMount = _g === void 0 ? [] : _g, _h = _d.beforeMount, beforeMount = _h === void 0 ? [] : _h, _j = _d.beforeLoad, beforeLoad = _j === void 0 ? [] : _j;
          return [4
          /*yield*/
          , execHooksChain(toArray(beforeLoad), app)];

        case 5:
          _m.sent();

          return [4
          /*yield*/
          , execScripts(global, !singular)];

        case 6:
          scriptExports = _m.sent();
          _k = getLifecyclesFromExports(scriptExports, appName, global), bootstrap = _k.bootstrap, mount = _k.mount, unmount = _k.unmount, update = _k.update;
          _l = getMicroAppStateActions(appInstanceId), onGlobalStateChange = _l.onGlobalStateChange, setGlobalState = _l.setGlobalState, offGlobalStateChange = _l.offGlobalStateChange;
          parcelConfig = {
            name: appInstanceId,
            bootstrap: bootstrap,
            mount: [function () {
              return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      return [4
                      /*yield*/
                      , validateSingularMode(singular, app)];

                    case 1:
                      if (_a.sent() && prevAppUnmountedDeferred) {
                        return [2
                        /*return*/
                        , prevAppUnmountedDeferred.promise];
                      }

                      return [2
                      /*return*/
                      , undefined];
                  }
                });
              });
            }, // 添加 mount hook, 确保每次应用加载前容器 dom 结构已经设置完毕
            function () {
              return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                  // element would be destroyed after unmounted, we need to recreate it if it not exist
                  element = element || createElement(appContent, strictStyleIsolation);
                  render({
                    element: element,
                    loading: true
                  }, 'mounting');
                  return [2
                  /*return*/
                  ];
                });
              });
            }, // exec the chain after rendering to keep the behavior with beforeLoad
            function () {
              return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                  return [2
                  /*return*/
                  , execHooksChain(toArray(beforeMount), app)];
                });
              });
            }, mountSandbox, function (props) {
              return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                  return [2
                  /*return*/
                  , mount(__assign(__assign({}, props), {
                    container: containerGetter(),
                    setGlobalState: setGlobalState,
                    onGlobalStateChange: onGlobalStateChange
                  }))];
                });
              });
            }, // 应用 mount 完成后结束 loading
            function () {
              return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                  return [2
                  /*return*/
                  , render({
                    element: element,
                    loading: false
                  }, 'mounted')];
                });
              });
            }, function () {
              return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                  return [2
                  /*return*/
                  , execHooksChain(toArray(afterMount), app)];
                });
              });
            }, // initialize the unmount defer after app mounted and resolve the defer after it unmounted
            function () {
              return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      return [4
                      /*yield*/
                      , validateSingularMode(singular, app)];

                    case 1:
                      if (_a.sent()) {
                        prevAppUnmountedDeferred = new Deferred();
                      }

                      return [2
                      /*return*/
                      ];
                  }
                });
              });
            }],
            unmount: [function () {
              return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                  return [2
                  /*return*/
                  , execHooksChain(toArray(beforeUnmount), app)];
                });
              });
            }, function (props) {
              return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                  return [2
                  /*return*/
                  , unmount(__assign(__assign({}, props), {
                    container: containerGetter()
                  }))];
                });
              });
            }, unmountSandbox, function () {
              return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                  return [2
                  /*return*/
                  , execHooksChain(toArray(afterUnmount), app)];
                });
              });
            }, function () {
              return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                  render({
                    element: null,
                    loading: false
                  }, 'unmounted');
                  offGlobalStateChange(appInstanceId); // for gc

                  element = null;
                  return [2
                  /*return*/
                  ];
                });
              });
            }, function () {
              return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      return [4
                      /*yield*/
                      , validateSingularMode(singular, app)];

                    case 1:
                      if (_a.sent() && prevAppUnmountedDeferred) {
                        prevAppUnmountedDeferred.resolve();
                      }

                      return [2
                      /*return*/
                      ];
                  }
                });
              });
            }]
          };

          if (typeof update === 'function') {
            parcelConfig.update = update;
          }

          return [2
          /*return*/
          , parcelConfig];
      }
    });
  });
}