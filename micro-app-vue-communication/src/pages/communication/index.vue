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
    this.getUserInfo();
  },

  methods: {
    async getUserInfo() {
      this.userInfo = {
        nickname: "shadows",
        avatarUrl: "",
        gender: 1,
        country: "中国",
        province: "广东",
        city: "深圳",
      };
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