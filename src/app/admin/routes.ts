import Router, {RouteConfig} from "vue-router";
import {formationsRoute} from "./formation/_routes";
import {speakersRoute} from "./speaker/routes";
import {traineesRoute} from "./trainee/route";

const Foo = {template: `<div class="foo"><h1>foo</h1></div>`};

const homeRoute = {path: "/home", name: "Accueil", meta: {icon: "fa-tachometer"}, component: Foo};

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


