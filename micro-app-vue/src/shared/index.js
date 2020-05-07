class Shared {
  /**
   * 获取 Token
   */
  getToken() {
    // 子应用独立运行时，在 localStorage 中获取 token
    return localStorage.getItem("token") || "";
  }

  /**
   * 设置 Token
   */
  setToken(token) {
    // 子应用独立运行时，在 localStorage 中设置 token
    localStorage.setItem("token", token);
  }
}

class SharedModule {
  static shared = new Shared();

  /**
   * 重载 shared
   */
  static overloadShared(shared) {
    SharedModule.shared = shared;
  }

  /**
   * 获取 shared 实例
   */
  static getShared() {
    return SharedModule.shared;
  }
}

export default SharedModule;