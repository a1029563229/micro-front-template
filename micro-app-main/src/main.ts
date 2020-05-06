import Vue from "vue";
import Antd from "ant-design-vue";
import VueRouter from "vue-router";

import App from "./App.vue";
import routes from "./routes";
import mountApps from "./micro";
import "./assets/styles/locale.antd.css";

Vue.use(VueRouter);
Vue.use(Antd);
Vue.config.productionTip = false;

mountApps({
  // sandbox: {
  //   strictStyleIsolation: true,
  // },
});

const router = new VueRouter({
  mode: "history",
  routes,
});

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#main-app");
