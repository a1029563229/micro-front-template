import axios from "axios";

const instance = axios.create({
  baseURL: "http://dev-api.jt-gmall.com",
});

instance.interceptors.response.use(reply => reply.data);

/**
 * 快速登录
 */
export const ApiLoginQuickly = () => {
  return instance.post("/member", {
    query: "{ loginQuickly { token } }",
  });
};
