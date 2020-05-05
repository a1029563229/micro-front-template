import Vue from "vue";
import VueRouter from "vue-router";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";

import "./public-path";
import App from "./App.vue";
import routes from "./routes";

Vue.use(Antd);
Vue.config.productionTip = false;

let instance = null;
let router = null;

if (!window.__POWERED_BY_QIANKUN__) {
  render()
}

function render(props = {}) {
  const { container } = props;

  router = new VueRouter({
    base: window.__POWERED_BY_QIANKUN__ ? "/vue" : "/",
    mode: "history",
    routes,
  });

  instance = new Vue({
    router,
    render: (h) => h(App),
  }).$mount(container ? container.querySelector("#app") : "#app");
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
