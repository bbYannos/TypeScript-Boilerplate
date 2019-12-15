import Api from "modules/Api/Api.module";
import {Formation} from "modules/Api/Model/Formation";
import Router, {RouteConfig} from "vue-router";
import {Speaker} from "../../modules/Api/Model/Speaker";
import {FormationsLayout} from "./formation/list.layout";
import {SpeakersLayout} from "./speaker/list.layout";

const Foo = {template: `<div class="foo"><h1>foo</h1></div>`};
const FormationLayout = {template: `<div class="foo"><h1>Formation {{ $route.params.identifier }}</h1></div>`};
const SpeakerLayout = {template: `<div class="foo"><h1>Intervenants {{ $route.params.identifier }}</h1></div>`};

const formationRoute = {
  path: ":identifier",
  name: "Formation",
  component: FormationLayout,
  meta: {
    elements: [],
  },
};


const homeRoute = {path: "/home", name: "Accueil", meta: {icon: "fa-tachometer"}, component: Foo};
const formationsRoute = {
  path: "/formations", name: "Formations", redirect: "/formations/list",
  meta: {icon: "fa-leanpub"},
  component: {template: "<router-view />"},
  children: [
    {path: "list", name: "List", component: FormationsLayout},
    formationRoute,
  ],
};

Api.formationService.fetchAll$.subscribe((formations: Formation[]) => {
  formationRoute.meta.elements = formations;
});


const speakerRoute = {
  path: ":identifier", name: "Speaker", component: SpeakerLayout, meta: {
    elements: [],
  },
};

const speakersRoute = {
  path: "/speakers",
  name: "Intervenants",
  meta: {icon: "fa-user"},
  redirect: "/speakers/list",
  component: {template: "<router-view />"},
  children: [
    {path: "list", name: "List", component: SpeakersLayout},
    speakerRoute,
  ],
};

Api.speakerService.fetchAll$.subscribe((speakers: Speaker[]) => {
  speakerRoute.meta.elements = speakers;
});



export const adminRoutes: RouteConfig[] = [
  homeRoute,
  formationsRoute,
  speakersRoute,
];

export const adminRouter = new Router({
  linkActiveClass: "active",
  linkExactActiveClass: "active",
  routes: adminRoutes,
});


adminRouter.beforeEach((to, from, next) => {
  console.log(to.path);
  next();
});

