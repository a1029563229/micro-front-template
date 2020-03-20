<template>
  <section id="main-app">
    <section class="menu">
      <a-menu
      style="min-height:100vh;"
      :selectedKeys="[currentRoute]"
      mode="inline"
      theme="dark"
    >
        <a-menu-item key="0">
          <router-link :to="{ path: '/' }">
            <a-icon type="pie-chart" />
            <span>应用主页</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="1">
          <router-link :to="{ path: '/react' }">
            <a-icon type="pie-chart" />
            <span>React 子应用</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="2">
          <router-link :to="{ path: '/vue' }">
            <a-icon type="desktop" />
            <span>Vue 子应用</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="7">
          <router-link :to="{ path: '/ery' }">
            <a-icon type="desktop" />
            <span>Jquery 子应用</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="3">
          <router-link :to="{ path: '/react/list' }">
            <a-icon type="pie-chart" />
            <span>React 子应用列表页</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="4">
          <router-link :to="{ path: '/vue/list' }">
            <a-icon type="desktop" />
            <span>Vue 子应用列表页</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="5">
          <router-link :to="{ path: '/react/status' }">
            <a-icon type="pie-chart" />
            <span>React 公共状态页</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="6">
          <router-link :to="{ path: '/vue/status' }">
            <a-icon type="desktop" />
            <span>Vue 公共状态页</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="8">
          <router-link :to="{ path: '/jquery/status' }">
            <a-icon type="desktop" />
            <span>Jquery 公共状态页</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="9">
          <router-link :to="{ path: '/combine' }">
            <a-icon type="desktop" />
            <span>同时展示两个子应用</span>
          </router-link>
        </a-menu-item>
      </a-menu>
    </section>
    <router-view v-show="$route.path === '/'"></router-view>
    <section v-show="$route.path !== '/' && $route.path !== '/combine'" id="frame">
    </section>
    <section v-show="$route.path === '/combine'" class="frame-2">
      <section id="combineA"></section>
      <section id="combineB"></section>
    </section>
  </section>
</template>

<script>
const routes = ['/', '/react', '/vue', '/react/list', '/vue/list', '/react/status', '/vue/status', '/ery', '/jquery/status', '/combine'];

export default {
  name: 'App',
  components: {
  },
  computed: {
    currentRoute() {
      return routes.findIndex(route => route === this.$route.path) + '';
    }
  },
}
</script>

<style scoped lang="less">
#main-app {
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
.menu {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 250px;
  min-height: 100vh;
  a {
    color: #fff;
  }
}
#frame,
.frame-2 {
  flex-grow: 1;
}
.frame-2 {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  section {
    width: 49%;
    min-height: 100vh;
  }
}
#combineA {
  border: 1px solid green;
}
#combineB {
  border: 1px solid red;
}
</style>
