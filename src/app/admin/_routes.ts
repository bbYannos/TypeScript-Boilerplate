import Router, {RouteConfig} from "vue-router";
import {formationsRoute} from "./formation/_routes";
import {homeRoute} from "./home/_routes";
import {speakersRoute} from "./speaker/_routes";
import {traineesRoute} from "./trainee/_routes";

export const adminRoutes: RouteConfig[] = [
  homeRoute,
  traineesRoute,
  formationsRoute,
  speakersRoute,
];

export const adminRouter = new Router({
  linkActiveClass: "active",
  linkExactActiveClass: "active",
  routes: adminRoutes,
});


