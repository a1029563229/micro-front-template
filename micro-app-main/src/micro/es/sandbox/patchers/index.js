import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

/**
 * @author Kuitos
 * @since 2019-04-11
 */
import { SandBoxType } from '../../interfaces';
import patchDynamicAppend from './dynamicAppend';
import patchHistoryListener from './historyListener';
import patchInterval from './interval';
import patchWindowListener from './windowListener';
import patchUIEvent from './UIEvent';
import * as css from './css';
export function patchAtMounting(appName, elementGetter, sandbox, singular, scopedCSS, excludeAssetFilter) {
  var _patchersInSandbox;

  var _a;

  var basePatchers = [function () {
    return patchInterval(sandbox.proxy);
  }, function () {
    return patchWindowListener(sandbox.proxy);
  }, function () {
    return patchHistoryListener();
  }, function () {
    return patchDynamicAppend(appName, elementGetter, sandbox.proxy, true, singular, scopedCSS, excludeAssetFilter);
  }];
  var patchersInSandbox = (_patchersInSandbox = {}, _defineProperty(_patchersInSandbox, SandBoxType.LegacyProxy, [].concat(basePatchers, [function () {
    return patchUIEvent(sandbox.proxy);
  }])), _defineProperty(_patchersInSandbox, SandBoxType.Proxy, [].concat(basePatchers, [function () {
    return patchUIEvent(sandbox.proxy);
  }])), _defineProperty(_patchersInSandbox, SandBoxType.Snapshot, basePatchers), _patchersInSandbox);
  return (_a = patchersInSandbox[sandbox.type]) === null || _a === void 0 ? void 0 : _a.map(function (patch) {
    return patch();
  });
}
export function patchAtBootstrapping(appName, elementGetter, sandbox, singular, scopedCSS, excludeAssetFilter) {
  var _patchersInSandbox2;

  var _a;

  var basePatchers = [function () {
    return patchDynamicAppend(appName, elementGetter, sandbox.proxy, false, singular, scopedCSS, excludeAssetFilter);
  }];
  var patchersInSandbox = (_patchersInSandbox2 = {}, _defineProperty(_patchersInSandbox2, SandBoxType.LegacyProxy, basePatchers), _defineProperty(_patchersInSandbox2, SandBoxType.Proxy, basePatchers), _defineProperty(_patchersInSandbox2, SandBoxType.Snapshot, basePatchers), _patchersInSandbox2);
  return (_a = patchersInSandbox[sandbox.type]) === null || _a === void 0 ? void 0 : _a.map(function (patch) {
    return patch();
  });
}
export { css };