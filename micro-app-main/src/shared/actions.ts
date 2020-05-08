// 当前版本 qiankun 对 insertBefore 处理有问题，这里先使用修改后的本地包
import { initGlobalState, MicroAppStateActions } from "@/micro/es";

const initialState = {};
const actions: MicroAppStateActions = initGlobalState(initialState);

export default actions;