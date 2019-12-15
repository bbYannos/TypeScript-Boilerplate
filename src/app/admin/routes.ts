import Vue from "vue";
import Router, {RouteConfig} from "vue-router";
import {FormationsLayout} from "./formation/list.layout";
import {SpeakersLayout} from "./speaker/list.layout";
const Foo = { template: `<div class="foo"><h1>foo</h1></div>` }

export const adminRoutes: RouteConfig[] = [
  { path: "/", name: "adminHome", component: Foo },
  { path: "/formations", name: "Formations", component: FormationsLayout },
  { path: "/intervenants", name: "Intervenants", component: SpeakersLayout },
];

export const adminRouter = new Router({
  routes: adminRoutes,
});


