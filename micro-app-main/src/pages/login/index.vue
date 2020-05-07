<template>
  <section class="login-container">
    <a-button size="large" type="primary" @click="login">Login</a-button>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
/* eslint-disable */
import VueRouter from "vue-router";

import shared from "@/shared";
import { ApiLoginQuickly } from "@/apis";

@Component
export default class Login extends Vue {
  $router!: VueRouter;

  async login() {
    // ApiLoginQuickly 是一个远程登录函数，用于获取 token，详见 Demo
    const result = await ApiLoginQuickly();
    const { token } = result.data.loginQuickly;

    // 使用 shared 的 setToken 记录 token
    shared.setToken(token);
    this.$router.push("/");
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/styles/flex.less";

.login-container {
  padding: 30px;
}
</style>
