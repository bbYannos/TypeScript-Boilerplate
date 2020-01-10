import {RouteConfig} from "vue-router";
import {InfosLayout} from "./infos/infos.layout";
import {PlanningLayout} from "./planning/planning.layout";
import {TrainingsLayout} from "./trainings/trainings.layout";

export const formationRoutes: RouteConfig[] = [{
  path: "planning", name: "Planning",
  meta: {icon: "fa-calendar-check-o"},
  component: PlanningLayout,
}, {
  path: "trainings", name: "Cours et modules",
  meta: {icon: "fa-bars"},
  component: TrainingsLayout,
}, {
  path: "infos", name: "Infos formation",
  meta: {icon: "fa-clock-o"},
  component: InfosLayout,
},
];
