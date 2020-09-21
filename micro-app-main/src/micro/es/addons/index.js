import _concat from "lodash/concat";
import _mergeWith from "lodash/mergeWith";
import getRuntimePublicPathAddOn from './runtimePublicPath';
import getEngineFlagAddon from './engineFlag';
export default function getAddOns(global, publicPath) {
  return _mergeWith({}, getEngineFlagAddon(global), getRuntimePublicPathAddOn(global, publicPath), function (v1, v2) {
    return _concat(v1 !== null && v1 !== void 0 ? v1 : [], v2 !== null && v2 !== void 0 ? v2 : []);
  });
}