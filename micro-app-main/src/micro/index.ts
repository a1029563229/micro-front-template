import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { message } from "ant-design-vue";
import {
  registerMicroApps,
  addGlobalUncaughtErrorHandler,
  runAfterFirstMounted,
  start,
} from "qiankun";

import apps from "./apps";

registerMicroApps(apps, {
  beforeLoad: (app: any) => {
    NProgress.start();
    console.log("before load", app.name);
    return Promise.resolve();
  },
  afterMount: (app: any) => {
    NProgress.done();
    console.log("after mount", app.name);
    return Promise.resolve();
  },
});

/**
 * 全局
 */
addGlobalUncaughtErrorHandler((event: Event | string) => {
  const { message: msg } = event as any;
  if (msg && msg.includes("died in status LOADING_SOURCE_CODE")) {
    message.error("子应用加载失败，请检查应用是否可运行");
  }
});

runAfterFirstMounted(() => {
  console.log("[MainApp] first app mounted");
});

export default start;
