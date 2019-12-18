import {RouteConfig} from "vue-router";
import {TrainingsLayout} from "./trainings.layout";

const Foo = {template: "<h1>{{$route.name}}</h1>"};
export const formationRoutes: RouteConfig[] = [{
  path: "planning", name: "Planning",
  meta: {icon: "fa-calendar-check-o"},
  component: Foo,
}, {
  path: "trainings", name: "Cours et modules",
  meta: {icon: "fa-bars"},
  component: TrainingsLayout,
}, {
  path: "availabilities", name: "Infos formation",
  meta: {icon: "fa-clock-o"},
  component: Foo,
},
];
