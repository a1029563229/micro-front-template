import shared from "@/shared";

const apps = [
  {
    name: "ReactMicroApp",
    entry: "//localhost:10100",
    container: "#frame",
    activeRule: "/react",
    // 通过 props 将 shared 传递给子应用
    props: { shared },
  },
  {
    name: "VueMicroApp",
    entry: "//localhost:10200",
    container: "#frame",
    activeRule: "/vue",
    // 通过 props 将 shared 传递给子应用
    props: { shared },
  },
  // Angular 应用暂时未接入
  // {
  //   name: "AngularMicroApp",
  //   entry: "//localhost:10300",
  //   container: "#frame",
  //   activeRule: "/angular"
  // }
];

export default apps;
