import {Role} from "modules/Api/Model/WpUser.Model";
import {RouteConfig as VueRouteConfig} from "vue-router";
import {LoginPageLayout} from "../login/login-page.layout";

export const Roles: { [key: string]: Role } = {
  Admin: "administrator",
  Speaker: "speaker",
  Trainee: "trainee",
};

export interface RouteMeta {
  authorize?: Role[];
  logout?: boolean;
}

interface RouteConfig extends VueRouteConfig {
  meta?: RouteMeta;
}


export const homeRoute = {path: "/", meta: {authorize: [null]}};
export const loginRoute = {path: "/login", component: LoginPageLayout, meta: {authorize: [null]}};
export const afterLoginRoute = homeRoute;
export const afterLogoutRoute = homeRoute;
const routes: RouteConfig[] = [homeRoute, loginRoute];

const lazyRoutes: RouteConfig[] = [
  {
    path: "/speaker",
    component: () => import(/* webpackChunkName: "speaker" */ "../speaker/page.layout"),
    meta: {authorize: [Roles.Speaker]}
  },
  // {path: "/admin", component:  import(/* webpackChunkName: "admin" */ "../admin/page.layout"), meta: {authorize: [Roles.Admin]}},
  // {path: "/admin", component:  import(/* webpackChunkName: "trainee" */ "../trainee/page.layout"), meta: {authorize: [Roles.Admin]}},
];
routes.concat(lazyRoutes);

export {routes};
