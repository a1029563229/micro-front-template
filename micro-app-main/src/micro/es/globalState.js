import _cloneDeep from "lodash/cloneDeep";
var gloabalState = {};
var deps = {}; // 触发全局监听

function emitGloabl(state, prevState) {
  Object.keys(deps).forEach(function (id) {
    if (deps[id] instanceof Function) {
      deps[id](_cloneDeep(state), _cloneDeep(prevState));
    }
  });
}

export function initGlobalState(state) {
  if (state === void 0) {
    state = {};
  }

  if (state === gloabalState) {
    console.warn('[qiankun] state has not changed！');
  } else {
    var prevGloabalState = _cloneDeep(gloabalState);

    gloabalState = _cloneDeep(state);
    emitGloabl(gloabalState, prevGloabalState);
  }

  return getMicroAppStateActions("gloabal-" + +new Date(), true);
}
export function getMicroAppStateActions(id, isMaster) {
  return {
    /**
     * onStateChange 全局依赖监听
     *
     * 收集 setState 时所需要触发的依赖
     *
     * 限制条件：每个子应用只有一个激活状态的全局监听，新监听覆盖旧监听，若只是监听部分属性，请使用 onStateChange
     *
     * 这么设计是为了减少全局监听滥用导致的内存爆炸
     *
     * 依赖数据结构为：
     * {
     *   {id}: callback
     * }
     *
     * @param callback
     * @param fireImmediately
     */
    onGlobalStateChange: function onGlobalStateChange(callback, fireImmediately) {
      if (!(callback instanceof Function)) {
        console.error('[qiankun] callback must be function!');
        return;
      }

      if (deps[id]) {
        console.warn("[qiankun] '" + id + "' gloabal listener already exists before this, new listener will overwrite it.");
      }

      deps[id] = callback;

      var cloneState = _cloneDeep(gloabalState);

      if (fireImmediately) {
        callback(cloneState, cloneState);
      }
    },

    /**
     * setGlobalState 更新 store 数据
     *
     * 1. 对输入 state 的第一层属性做校验，只有初始化时声明过的第一层（bucket）属性才会被更改
     * 2. 修改 store 并触发全局监听
     *
     * @param state
     */
    setGlobalState: function setGlobalState(state) {
      if (state === void 0) {
        state = {};
      }

      if (state === gloabalState) {
        console.warn('[qiankun] state has not changed！');
        return false;
      }

      var changeKeys = [];

      var prevGloabalState = _cloneDeep(gloabalState);

      gloabalState = _cloneDeep(Object.keys(state).reduce(function (_gloabalState, changeKey) {
        var _a;

        if (isMaster || changeKey in _gloabalState) {
          changeKeys.push(changeKey);
          return Object.assign(_gloabalState, (_a = {}, _a[changeKey] = state[changeKey], _a));
        }

        console.warn("[qiankun] '" + changeKey + "' not declared when init state\uFF01");
        return _gloabalState;
      }, gloabalState));

      if (changeKeys.length === 0) {
        console.warn('[qiankun] state has not changed！');
        return false;
      }

      emitGloabl(gloabalState, prevGloabalState);
      return true;
    },
    // 注销该应用下的依赖
    offGlobalStateChange: function offGlobalStateChange() {
      delete deps[id];
      return true;
    }
  };
}