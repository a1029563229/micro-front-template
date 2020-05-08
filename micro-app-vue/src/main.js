import Vue from "vue";
import VueRouter from "vue-router";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";

import "./public-path";
import App from "./App.vue";
import routes from "./routes";
import actions from "@/shared/actions";

Vue.use(Antd);
Vue.config.productionTip = false;

let instance = null;
let router = null;

if (!window.__POWERED_BY_QIANKUN__) {
  render()
}

/**
 * 渲染函数
 * 主应用生命周期钩子中运行/子应用单独启动时运行
 */
function render(props = {}) {
  if (props) {
    // 注入 actions 实例
    actions.setActions(props);
  }

  router = new VueRouter({
    base: window.__POWERED_BY_QIANKUN__ ? "/vue" : "/",
    mode: "history",
    routes,
  });

  // 挂载应用
  instance = new Vue({
    router,
    render: (h) => h(App),
  }).$mount("#app");
}

export async function bootstrap() {
  console.log("vue app bootstraped");
}

export async function mount(props) {
  console.log("vue mount", props);
  render(props);
}

export async function unmount() {
  console.log("vue unmount");
  instance.$destroy();
  instance = null;
  router = null;
}
