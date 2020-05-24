<template>
  <a-config-provider prefixCls="cns">
    <section>
      <section v-show="!$route.meta.withoutLayout" id="cns-main-app">
        <template>
          <section class="cns-menu-wrapper">
            <main-menu />
          </section>
          <section class="cns-frame-wrapper">
            <router-view v-show="$route.name" />
            <section v-show="!$route.name" id="frame"></section>
          </section>
        </template>
      </section>
      <router-view v-show="$route.meta.withoutLayout" />
    </section>
  </a-config-provider>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
/* eslint-disable */
import { Route } from "vue-router";

import actions from "@/shared/actions";
import MainMenu from "@/components/menu/index.vue";

@Component({
  components: {
    MainMenu
  }
})
export default class App extends Vue {
  $route!: Route;

  // `mounted` 是 Vue 的生命周期钩子函数，在组件挂载时执行
  mounted() {
    // 注册一个观察者函数
    actions.onGlobalStateChange((state, prevState) => {
      // state: 变更后的状态; prevState: 变更前的状态
      console.log("主应用观察者：globalState 改变前的值为 ", prevState);
      console.log("主应用观察者：登录状态发生改变，改变后的 globalState 的值为 ", state);
    });
  }
}
</script>

<style lang="less" scoped>
#cns-main-app {
  height: 100%;
  position: relative;
  .cns-menu-wrapper {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 40;
    width: 172px;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .cns-nav-wrapper {
    position: fixed;
    width: 100%;
    min-width: 1060px;
    padding-left: 172px;
    left: 0;
    top: 0;
    z-index: 30;
  }
}

.cns-frame-wrapper {
  padding-left: 172px;
  flex-grow: 1;
  height: 100%;
  width: 100%;
  position: relative;
}

#cns-frame {
  width: 100%;
  height: 100%;
  > :first-child {
    height: 100%;
  }
}
</style>
