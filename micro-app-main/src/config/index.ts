import envConfig from "./config.json";

type Config = {
  REACT_MICRO_APP: string;
  VUE_MICRO_APP: string;
  ANGULAR_MICRO_APP: string;
  STATIC_MICRO_APP: string;
};

// 使用 NODE_ENV 区分不同环境，默认值为 development
const ENV = process.env.NODE_ENV || "development";
const config: Config = (<any>envConfig)[ENV];

// 导出当前环境的配置，默认为 dev 环境
export default config;
