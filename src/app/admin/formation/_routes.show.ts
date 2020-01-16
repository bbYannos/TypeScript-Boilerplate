import {RouteConfig} from "vue-router";
import {InfosLayout} from "./infos/infos.layout";
import {PlanningLayout} from "./planning/planning.layout";
import {ScoresLayout} from "./scores/scores.layout";
import {TrainingsLayout} from "./trainings/trainings.layout";

export const formationRoutes: RouteConfig[] = [{
  path: "scores",
  meta: {
    label: "Notes",
    icon: "fa-star",
  },
  component: ScoresLayout,
}, {
  path: "planning",
  meta: {
    label: "Planning",
    icon: "fa-calendar-check-o",
  },
  component: PlanningLayout,
}, {
  path: "trainings",
  meta: {
    label: "Cours et modules",
    icon: "fa-bars",
  },
  component: TrainingsLayout,
}, {
  path: "infos",
  meta: {
    label: "Infos formation",
    icon: "fa-clock-o",
  },
  component: InfosLayout,
},
];
