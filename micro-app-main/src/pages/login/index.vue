<template>
  <section class="login-container">
    <a-button size="large" type="primary" @click="login">Login</a-button>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
/* eslint-disable */
import VueRouter from "vue-router";

import actions from "@/shared/actions";
import { ApiLoginQuickly } from "@/apis";

@Component
export default class Login extends Vue {
  $router!: VueRouter;

  // `mounted` 是 Vue 的生命周期钩子函数，在组件挂载时执行
  mounted() {
    // 注册一个观察者函数
    actions.onGlobalStateChange((state, prevState) => {
      // state: 变更后的状态; prevState: 变更前的状态
      console.log("主应用观察者：token 改变前的值为 ", prevState.token);
      console.log("主应用观察者：登录状态发生改变，改变后的 token 的值为 ", state.token);
      
      this.$router.push("/");
    });
  }
  
  async login() {
    // ApiLoginQuickly 是一个远程登录函数，用于获取 token，详见 Demo
    const result = await ApiLoginQuickly();
    const { token } = result.data.loginQuickly;

    // 登录成功后，设置 token
    actions.setGlobalState({ token });
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/styles/flex.less";

.login-container {
  padding: 30px;
}
</style>
