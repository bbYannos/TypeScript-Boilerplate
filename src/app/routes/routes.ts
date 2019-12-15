import {Role} from "modules/Api/Model/User/WpUser.Model";
import {RouteConfig as VueRouteConfig} from "vue-router";
import {LoginPageLayout} from "../login/page.layout";

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
let routes: RouteConfig[] = [homeRoute, loginRoute];

const SpeakerPageLayout = () => import(/* webpackChunkName: "speaker" */ "../speaker/page.layout");
const TraineePageLayout = () => import(/* webpackChunkName: "trainee" */ "../trainee/page.layout");
const AdminPageLayout = () => import(/* webpackChunkName: "admin" */ "../admin/page.layout");
const lazyRoutes: RouteConfig[] = [
  {
    path: "/speaker",
    component: SpeakerPageLayout,
    meta: {authorize: [Roles.Speaker]},
  }, {
    path: "/trainee",
    component: TraineePageLayout,
    meta: {authorize: [Roles.Trainee]},
  }, {
    path: "/admin",
    component: AdminPageLayout,
    meta: {authorize: [Roles.Admin]},
  },
];
routes = routes.concat(lazyRoutes);

export {routes};
