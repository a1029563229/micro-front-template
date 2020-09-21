import _concat from "lodash/concat";
import _mergeWith2 from "lodash/mergeWith";
import _typeof from "@babel/runtime/helpers/esm/typeof";
import _regeneratorRuntime from "@babel/runtime/regenerator";

/**
 * @author Kuitos
 * @since 2020-04-01
 */
import { __awaiter, __rest } from "tslib";
import { importEntry } from 'import-html-entry';
import getAddOns from './addons';
import { getMicroAppStateActions } from './globalState';
import { createSandbox, css } from './sandbox';
import { Deferred, getDefaultTplWrapper, getWrapperId, performanceMark, performanceMeasure, toArray, validateExportLifecycle, isEnableScopedCSS } from './utils';

function assertElementExist(element, msg) {
  if (!element) {
    if (msg) {
      throw new Error(msg);
    }

    throw new Error('[qiankun] element not existed!');
  }
}

function execHooksChain(hooks, app) {
  var global = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : window;

  if (hooks.length) {
    return hooks.reduce(function (chain, hook) {
      return chain.then(function () {
        return hook(app, global);
      });
    }, Promise.resolve());
  }

  return Promise.resolve();
}

function validateSingularMode(validate, app) {
  return __awaiter(this, void 0, void 0, /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", typeof validate === 'function' ? validate(app) : !!validate);

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
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


function getAppWrapperGetter(appName, appInstanceId, useLegacyRender, strictStyleIsolation, enableScopedCSS, elementGetter) {
  return function () {
    if (useLegacyRender) {
      if (strictStyleIsolation) throw new Error('[qiankun]: strictStyleIsolation can not be used with legacy render!');
      if (enableScopedCSS) throw new Error('[qiankun]: experimentalStyleIsolation can not be used with legacy render!');
      var appWrapper = document.getElementById(getWrapperId(appInstanceId));
      assertElementExist(appWrapper, "[qiankun] Wrapper element for ".concat(appName, " with instance ").concat(appInstanceId, " is not existed!"));
      return appWrapper;
    }

    var element = elementGetter();
    assertElementExist(element, "[qiankun] Wrapper element for ".concat(appName, " with instance ").concat(appInstanceId, " is not existed!"));

    if (enableScopedCSS) {
      var attr = element.getAttribute(css.QiankunCSSRewriteAttr);

      if (!attr) {
        element.setAttribute(css.QiankunCSSRewriteAttr, appName);
      }
    }

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
  var render = function render(_ref, phase) {
    var element = _ref.element,
        loading = _ref.loading;

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
            return "[qiankun] Target container with ".concat(container, " not existed while ").concat(appName, " ").concat(phase, "!");

          case 'mounted':
            return "[qiankun] Target container with ".concat(container, " not existed after ").concat(appName, " ").concat(phase, "!");

          default:
            return "[qiankun] Target container with ".concat(container, " not existed while ").concat(appName, " rendering!");
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
    console.warn("[qiankun] lifecycle not found from ".concat(appName, " entry exports, fallback to get from window['").concat(appName, "']"));
  } // fallback to global variable who named with ${appName} while module exports not found


  var globalVariableExports = global[appName];

  if (validateExportLifecycle(globalVariableExports)) {
    return globalVariableExports;
  }

  throw new Error("[qiankun] You need to export lifecycle functions in ".concat(appName, " entry"));
}

var prevAppUnmountedDeferred;
export function loadApp(app) {
  var configuration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var lifeCycles = arguments.length > 2 ? arguments[2] : undefined;
  return __awaiter(this, void 0, void 0, /*#__PURE__*/_regeneratorRuntime.mark(function _callee16() {
    var _this = this;

    var entry, appName, appInstanceId, markName, _configuration$singul, singular, _configuration$sandbo, sandbox, excludeAssetFilter, importEntryOpts, _yield$importEntry, template, execScripts, assetPublicPath, strictStyleIsolation, enableScopedCSS, appContent, element, styleNodes, container, legacyRender, render, containerGetter, global, mountSandbox, unmountSandbox, sandboxInstance, _mergeWith, _mergeWith$beforeUnmo, beforeUnmount, _mergeWith$afterUnmou, afterUnmount, _mergeWith$afterMount, afterMount, _mergeWith$beforeMoun, beforeMount, _mergeWith$beforeLoad, beforeLoad, scriptExports, _getLifecyclesFromExp, bootstrap, mount, unmount, update, _getMicroAppStateActi, onGlobalStateChange, setGlobalState, offGlobalStateChange, parcelConfig;

    return _regeneratorRuntime.wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            entry = app.entry, appName = app.name;
            appInstanceId = "".concat(appName, "_").concat(+new Date(), "_").concat(Math.floor(Math.random() * 1000));
            markName = "[qiankun] App ".concat(appInstanceId, " Loading");

            if (process.env.NODE_ENV === 'development') {
              performanceMark(markName);
            }

            _configuration$singul = configuration.singular, singular = _configuration$singul === void 0 ? false : _configuration$singul, _configuration$sandbo = configuration.sandbox, sandbox = _configuration$sandbo === void 0 ? true : _configuration$sandbo, excludeAssetFilter = configuration.excludeAssetFilter, importEntryOpts = __rest(configuration, ["singular", "sandbox", "excludeAssetFilter"]); // get the entry html content and script executor

            _context16.next = 7;
            return importEntry(entry, importEntryOpts);

          case 7:
            _yield$importEntry = _context16.sent;
            template = _yield$importEntry.template;
            execScripts = _yield$importEntry.execScripts;
            assetPublicPath = _yield$importEntry.assetPublicPath;
            _context16.next = 13;
            return validateSingularMode(singular, app);

          case 13:
            if (!_context16.sent) {
              _context16.next = 16;
              break;
            }

            _context16.next = 16;
            return prevAppUnmountedDeferred && prevAppUnmountedDeferred.promise;

          case 16:
            strictStyleIsolation = _typeof(sandbox) === 'object' && !!sandbox.strictStyleIsolation;
            enableScopedCSS = isEnableScopedCSS(configuration);
            appContent = getDefaultTplWrapper(appInstanceId, appName)(template);
            element = createElement(appContent, strictStyleIsolation);

            if (element && isEnableScopedCSS(configuration)) {
              styleNodes = element.querySelectorAll('style') || [];
              styleNodes.forEach(function (stylesheetElement) {
                css.process(element, stylesheetElement, appName);
              });
            }

            container = 'container' in app ? app.container : undefined;
            legacyRender = 'render' in app ? app.render : undefined;
            render = getRender(appName, appContent, container, legacyRender); // 第一次加载设置应用可见区域 dom 结构
            // 确保每次应用加载前容器 dom 结构已经设置完毕

            render({
              element: element,
              loading: true
            }, 'loading');
            containerGetter = getAppWrapperGetter(appName, appInstanceId, !!legacyRender, strictStyleIsolation, enableScopedCSS, function () {
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
              sandboxInstance = createSandbox(appName, containerGetter, Boolean(singular), enableScopedCSS, excludeAssetFilter); // 用沙箱的代理对象作为接下来使用的全局对象

              global = sandboxInstance.proxy;
              mountSandbox = sandboxInstance.mount;
              unmountSandbox = sandboxInstance.unmount;
            }

            _mergeWith = _mergeWith2({}, getAddOns(global, assetPublicPath), lifeCycles, function (v1, v2) {
              return _concat(v1 !== null && v1 !== void 0 ? v1 : [], v2 !== null && v2 !== void 0 ? v2 : []);
            }), _mergeWith$beforeUnmo = _mergeWith.beforeUnmount, beforeUnmount = _mergeWith$beforeUnmo === void 0 ? [] : _mergeWith$beforeUnmo, _mergeWith$afterUnmou = _mergeWith.afterUnmount, afterUnmount = _mergeWith$afterUnmou === void 0 ? [] : _mergeWith$afterUnmou, _mergeWith$afterMount = _mergeWith.afterMount, afterMount = _mergeWith$afterMount === void 0 ? [] : _mergeWith$afterMount, _mergeWith$beforeMoun = _mergeWith.beforeMount, beforeMount = _mergeWith$beforeMoun === void 0 ? [] : _mergeWith$beforeMoun, _mergeWith$beforeLoad = _mergeWith.beforeLoad, beforeLoad = _mergeWith$beforeLoad === void 0 ? [] : _mergeWith$beforeLoad;
            _context16.next = 33;
            return execHooksChain(toArray(beforeLoad), app, global);

          case 33:
            _context16.next = 35;
            return execScripts(global, !singular);

          case 35:
            scriptExports = _context16.sent;
            _getLifecyclesFromExp = getLifecyclesFromExports(scriptExports, appName, global), bootstrap = _getLifecyclesFromExp.bootstrap, mount = _getLifecyclesFromExp.mount, unmount = _getLifecyclesFromExp.unmount, update = _getLifecyclesFromExp.update;
            _getMicroAppStateActi = getMicroAppStateActions(appInstanceId), onGlobalStateChange = _getMicroAppStateActi.onGlobalStateChange, setGlobalState = _getMicroAppStateActi.setGlobalState, offGlobalStateChange = _getMicroAppStateActi.offGlobalStateChange;
            parcelConfig = {
              name: appInstanceId,
              bootstrap: bootstrap,
              mount: [function () {
                return __awaiter(_this, void 0, void 0, /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
                  var marks;
                  return _regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          if (process.env.NODE_ENV === 'development') {
                            marks = performance.getEntriesByName(markName, 'mark'); // mark length is zero means the app is remounting

                            if (!marks.length) {
                              performanceMark(markName);
                            }
                          }

                        case 1:
                        case "end":
                          return _context2.stop();
                      }
                    }
                  }, _callee2);
                }));
              }, function () {
                return __awaiter(_this, void 0, void 0, /*#__PURE__*/_regeneratorRuntime.mark(function _callee3() {
                  return _regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                      switch (_context3.prev = _context3.next) {
                        case 0:
                          _context3.next = 2;
                          return validateSingularMode(singular, app);

                        case 2:
                          _context3.t0 = _context3.sent;

                          if (!_context3.t0) {
                            _context3.next = 5;
                            break;
                          }

                          _context3.t0 = prevAppUnmountedDeferred;

                        case 5:
                          if (!_context3.t0) {
                            _context3.next = 7;
                            break;
                          }

                          return _context3.abrupt("return", prevAppUnmountedDeferred.promise);

                        case 7:
                          return _context3.abrupt("return", undefined);

                        case 8:
                        case "end":
                          return _context3.stop();
                      }
                    }
                  }, _callee3);
                }));
              }, // 添加 mount hook, 确保每次应用加载前容器 dom 结构已经设置完毕
              function () {
                return __awaiter(_this, void 0, void 0, /*#__PURE__*/_regeneratorRuntime.mark(function _callee4() {
                  return _regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                      switch (_context4.prev = _context4.next) {
                        case 0:
                          // element would be destroyed after unmounted, we need to recreate it if it not exist
                          element = element || createElement(appContent, strictStyleIsolation);
                          render({
                            element: element,
                            loading: true
                          }, 'mounting');

                        case 2:
                        case "end":
                          return _context4.stop();
                      }
                    }
                  }, _callee4);
                }));
              }, mountSandbox, // exec the chain after rendering to keep the behavior with beforeLoad
              function () {
                return __awaiter(_this, void 0, void 0, /*#__PURE__*/_regeneratorRuntime.mark(function _callee5() {
                  return _regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                      switch (_context5.prev = _context5.next) {
                        case 0:
                          return _context5.abrupt("return", execHooksChain(toArray(beforeMount), app, global));

                        case 1:
                        case "end":
                          return _context5.stop();
                      }
                    }
                  }, _callee5);
                }));
              }, function (props) {
                return __awaiter(_this, void 0, void 0, /*#__PURE__*/_regeneratorRuntime.mark(function _callee6() {
                  return _regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                      switch (_context6.prev = _context6.next) {
                        case 0:
                          return _context6.abrupt("return", mount(Object.assign(Object.assign({}, props), {
                            container: containerGetter(),
                            setGlobalState: setGlobalState,
                            onGlobalStateChange: onGlobalStateChange
                          })));

                        case 1:
                        case "end":
                          return _context6.stop();
                      }
                    }
                  }, _callee6);
                }));
              }, // 应用 mount 完成后结束 loading
              function () {
                return __awaiter(_this, void 0, void 0, /*#__PURE__*/_regeneratorRuntime.mark(function _callee7() {
                  return _regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                      switch (_context7.prev = _context7.next) {
                        case 0:
                          return _context7.abrupt("return", render({
                            element: element,
                            loading: false
                          }, 'mounted'));

                        case 1:
                        case "end":
                          return _context7.stop();
                      }
                    }
                  }, _callee7);
                }));
              }, function () {
                return __awaiter(_this, void 0, void 0, /*#__PURE__*/_regeneratorRuntime.mark(function _callee8() {
                  return _regeneratorRuntime.wrap(function _callee8$(_context8) {
                    while (1) {
                      switch (_context8.prev = _context8.next) {
                        case 0:
                          return _context8.abrupt("return", execHooksChain(toArray(afterMount), app, global));

                        case 1:
                        case "end":
                          return _context8.stop();
                      }
                    }
                  }, _callee8);
                }));
              }, // initialize the unmount defer after app mounted and resolve the defer after it unmounted
              function () {
                return __awaiter(_this, void 0, void 0, /*#__PURE__*/_regeneratorRuntime.mark(function _callee9() {
                  return _regeneratorRuntime.wrap(function _callee9$(_context9) {
                    while (1) {
                      switch (_context9.prev = _context9.next) {
                        case 0:
                          _context9.next = 2;
                          return validateSingularMode(singular, app);

                        case 2:
                          if (!_context9.sent) {
                            _context9.next = 4;
                            break;
                          }

                          prevAppUnmountedDeferred = new Deferred();

                        case 4:
                        case "end":
                          return _context9.stop();
                      }
                    }
                  }, _callee9);
                }));
              }, function () {
                return __awaiter(_this, void 0, void 0, /*#__PURE__*/_regeneratorRuntime.mark(function _callee10() {
                  var measureName;
                  return _regeneratorRuntime.wrap(function _callee10$(_context10) {
                    while (1) {
                      switch (_context10.prev = _context10.next) {
                        case 0:
                          if (process.env.NODE_ENV === 'development') {
                            measureName = "[qiankun] App ".concat(appInstanceId, " Loading Consuming");
                            performanceMeasure(measureName, markName);
                          }

                        case 1:
                        case "end":
                          return _context10.stop();
                      }
                    }
                  }, _callee10);
                }));
              }],
              unmount: [function () {
                return __awaiter(_this, void 0, void 0, /*#__PURE__*/_regeneratorRuntime.mark(function _callee11() {
                  return _regeneratorRuntime.wrap(function _callee11$(_context11) {
                    while (1) {
                      switch (_context11.prev = _context11.next) {
                        case 0:
                          return _context11.abrupt("return", execHooksChain(toArray(beforeUnmount), app, global));

                        case 1:
                        case "end":
                          return _context11.stop();
                      }
                    }
                  }, _callee11);
                }));
              }, function (props) {
                return __awaiter(_this, void 0, void 0, /*#__PURE__*/_regeneratorRuntime.mark(function _callee12() {
                  return _regeneratorRuntime.wrap(function _callee12$(_context12) {
                    while (1) {
                      switch (_context12.prev = _context12.next) {
                        case 0:
                          return _context12.abrupt("return", unmount(Object.assign(Object.assign({}, props), {
                            container: containerGetter()
                          })));

                        case 1:
                        case "end":
                          return _context12.stop();
                      }
                    }
                  }, _callee12);
                }));
              }, unmountSandbox, function () {
                return __awaiter(_this, void 0, void 0, /*#__PURE__*/_regeneratorRuntime.mark(function _callee13() {
                  return _regeneratorRuntime.wrap(function _callee13$(_context13) {
                    while (1) {
                      switch (_context13.prev = _context13.next) {
                        case 0:
                          return _context13.abrupt("return", execHooksChain(toArray(afterUnmount), app, global));

                        case 1:
                        case "end":
                          return _context13.stop();
                      }
                    }
                  }, _callee13);
                }));
              }, function () {
                return __awaiter(_this, void 0, void 0, /*#__PURE__*/_regeneratorRuntime.mark(function _callee14() {
                  return _regeneratorRuntime.wrap(function _callee14$(_context14) {
                    while (1) {
                      switch (_context14.prev = _context14.next) {
                        case 0:
                          render({
                            element: null,
                            loading: false
                          }, 'unmounted');
                          offGlobalStateChange(appInstanceId); // for gc

                          element = null;

                        case 3:
                        case "end":
                          return _context14.stop();
                      }
                    }
                  }, _callee14);
                }));
              }, function () {
                return __awaiter(_this, void 0, void 0, /*#__PURE__*/_regeneratorRuntime.mark(function _callee15() {
                  return _regeneratorRuntime.wrap(function _callee15$(_context15) {
                    while (1) {
                      switch (_context15.prev = _context15.next) {
                        case 0:
                          _context15.next = 2;
                          return validateSingularMode(singular, app);

                        case 2:
                          _context15.t0 = _context15.sent;

                          if (!_context15.t0) {
                            _context15.next = 5;
                            break;
                          }

                          _context15.t0 = prevAppUnmountedDeferred;

                        case 5:
                          if (!_context15.t0) {
                            _context15.next = 7;
                            break;
                          }

                          prevAppUnmountedDeferred.resolve();

                        case 7:
                        case "end":
                          return _context15.stop();
                      }
                    }
                  }, _callee15);
                }));
              }]
            };

            if (typeof update === 'function') {
              parcelConfig.update = update;
            }

            return _context16.abrupt("return", parcelConfig);

          case 41:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16);
  }));
}