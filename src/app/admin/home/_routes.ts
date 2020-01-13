import {RouteConfig} from "vue-router";
import {DashboardLayout} from "./dashboard.layout";
const homeRoute: RouteConfig = {
  path: "/home", meta: {icon: "fa-tachometer", label: "Accueil"}, component: DashboardLayout
};

export {homeRoute};
