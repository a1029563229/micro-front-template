<template>
  <div id="app">
     <a-menu :selectedKeys="[currentRoute]" mode="horizontal" theme="dark">
      <a-menu-item 
        v-for="(item) in menus" 
        :key="item.key"
        >
        <router-link :to="item.route">{{item.title}}</router-link>
      </a-menu-item>
     </a-menu>
    <router-view :key="(new Date()).getTime()" />
  </div>
</template>

<script>
export default {
  name: 'App',

  data() {
    return {
      menus: [
        {
          key: "vue",
          route: "/vue",
          title: "主页"
        },
        {
          key: "vue-list",
          route: "/vue/list",
          title: "列表页"
        },
        {
          key: "vue-status",
          route: "/vue/status",
          title: "状态页"
        },
        {
          key: "react",
          route: "/react",
          title: "React 子应用"
        }
      ]
    }
  },
  
  computed: {
    currentRoute() {
      const menu = this.menus.find(item => item.route === this.$route.path)
      return menu ? menu.key : "vue";
    }
  },
}
</script>

<style>
</style>
