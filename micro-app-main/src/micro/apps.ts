const apps = [
  {
    name: "ReactMicroApp",
    entry: "//localhost:10100",
    container: "#frame",
    activeRule: "/react"
  },
  {
    name: "VueMicroApp",
    entry: "//localhost:10200",
    container: "#frame",
    activeRule: "/vue"
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