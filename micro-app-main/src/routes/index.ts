import Home from "@/pages/home/index.vue";
import Login from "@/pages/login/index.vue";
import Communication from "@/pages/communication/index.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    meta: { withoutLayout: true },
    component: Login,
  },
  {
    path: "/communication",
    name: "Communication",
    component: Communication,
  },
];

export default routes;
