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

import MainMenu from "@/components/menu/index.vue";

@Component({
  components: {
    MainMenu
  }
})
export default class App extends Vue {
  $route!: Route;
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
