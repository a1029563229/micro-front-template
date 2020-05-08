import React from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";

import App from "./App.jsx";
import actions from "@/shared/actions";

if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

function render(props = {}) {
  if (props) {
    // 注入 actions 实例
    actions.setActions(props);
  }
  
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
