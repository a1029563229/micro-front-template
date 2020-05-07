import React from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";

import App from "./App.jsx";
import SharedModule from "@/shared";

if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

function render(props = {}) {
  // 当传入的 shared 不为空时，则重载子应用的 shared
  const { shared = SharedModule.getShared() } = props;
  SharedModule.overloadShared(shared);
  
  ReactDOM.render(<App />, document.getElementById("root"));
}

export async function bootstrap() {
  console.log("react app bootstraped");
}

export async function mount(props) {
  console.log("reactApp mount", props);
  render(props);
}

export async function unmount() {
  console.log("react unmount");
  ReactDOM.unmountComponentAtNode(document.getElementById("root"));
}
