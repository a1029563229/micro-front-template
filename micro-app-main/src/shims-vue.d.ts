declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}

declare module "nprogress" {
  class NProgress {
    /** 开始加载 */
    static start: Function;
    /** 结束加载 */
    static done: Function;
  }
  export default NProgress;
}
