import {RouteConfig} from "vue-router";
import {DashboardLayout, dashboardRoutes, homePath} from "./dashboard.layout";

const dashBoardRoute: RouteConfig = {path: "dashboards", component: DashboardLayout};

const homeRoute: RouteConfig = {
  path: homePath, meta: {icon: "fa-tachometer", label: "Accueil"},
  redirect: homePath + "/" + dashBoardRoute.path,
  component: {template: "<router-view />"},
  children: [dashBoardRoute].concat(dashboardRoutes),
};

export {homeRoute};
