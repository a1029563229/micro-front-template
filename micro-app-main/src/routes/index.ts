import Home from "@/pages/home/index.vue";
import Communication from "@/pages/communication/index.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/communication",
    name: "Communication",
    component: Communication,
  },
];

export default routes;