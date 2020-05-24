<template>
  <section class="communication-to-parent-container">
    <a-button type="primary" @click="quicklyLogin">Quickly Login</a-button>
  </section>
</template>
<script>
// 引入 actions 实例
import actions from "@/shared/actions";
import { ApiLoginQuickly } from "@/apis";

export default {
  name: "CommunicationToParent",

  data() {
    return {};
  },

  methods: {
    async quicklyLogin() {
      // ApiLoginQuickly 是一个远程登录函数，用于获取 token，详见 Demo
      const result = await ApiLoginQuickly();
      const { token } = result.data.loginQuickly;

      // 登录成功后，设置 token
      actions.setGlobalState({ token });
    }
  }
};
</script>
<style lang="less" scoped>
@import "~@/assets/styles/flex.less";

.communication-to-parent-container {
  padding: 20px;
}
</style>