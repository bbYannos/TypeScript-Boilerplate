import {RouteConfig} from "vue-router";
import {InfosLayout} from "./infos/infos.layout";
import {PlanningLayout} from "./planning/planning.layout";
import {TrainingsLayout} from "./trainings/trainings.layout";

const Foo = {template: "<h1>{{$route.name}}</h1>"};

export const speakerRoutes: RouteConfig[] = [{
  path: "planning", name: "Planning",
  meta: {icon: "fa-calendar-check-o"},
  component: PlanningLayout,
}, {
  path: "trainings", name: "Liste des cours",
  meta: {icon: "fa-bars"},
  component: TrainingsLayout,
}, {
  path: "availabilities", name: "Disponibilités",
  meta: {icon: "fa-calendar-check-o"},
  component: InfosLayout,
},
];
