<template>
  <section class="communication-container">
    <a-card :title="`欢迎你，${userInfo.nickname}`">
      <section class="container">
        <div>
          <a-avatar :size="50" :src="userInfo.avatarUrl" />
        </div>
        <div>
          <span>用户名：</span>
          {{userInfo.nickname}}
        </div>
        <div>
          <span>性别：</span>
          {{userInfo.gender ? "男" : "女"}}
        </div>
        <div>
          <span>所在地：</span>
          {{`${userInfo.country} ${userInfo.province} ${userInfo.city}`}}
        </div>
      </section>
    </a-card>
  </section>
</template>
<script>
// 引入 SharedModule
import SharedModule from "@/shared";
import { ApiGetUserInfo } from "@/apis";

export default {
  name: "Communication",

  data() {
    return {
      userInfo: {}
    };
  },

  mounted() {
    const shared = SharedModule.getShared();
    // 使用 shared 获取 token
    const token = shared.getToken();

    // 未登录 - 返回主页
    if (!token) {
      this.$message.error("未检测到登录信息！");
      return this.$router.push("/");
    }

    this.getUserInfo(token);
  },

  methods: {
    async getUserInfo(token) {
      // ApiGetUserInfo 是用于获取用户信息的函数
      const result = await ApiGetUserInfo(token);
      this.userInfo = result.data.getUserInfo;
    }
  }
};
</script>
<style lang="less" scoped>
@import "~@/assets/styles/flex.less";

.communication-container {
  .container {
    .flex-center;
    padding-top: 30px;
    flex-wrap: wrap;
    div {
      width: 100%;
      margin: 10px;
      text-align: center;
      font-size: 16px;
      span {
        font-weight: bold;
      }
    }
  }
}
</style>