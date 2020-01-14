import {RouteConfig} from "vue-router";
import {InfosLayout} from "./infos/infos.layout";
import {PlanningLayout} from "./planning/planning.layout";
import {TrainingsLayout} from "./trainings/trainings.layout";

export const speakerRoutes: RouteConfig[] = [{
  path: "planning",
  meta: {
    label: "Planning",
    icon: "fa-calendar-check-o",
  },
  component: PlanningLayout,
}, {
  path: "trainings",
  meta: {
    label: "Liste des cours",
    icon: "fa-bars",
  },
  component: TrainingsLayout,
}, {
  path: "availabilities",
  meta: {
    label: "Disponibilités",
    icon: "fa-calendar-check-o",
  },
  component: InfosLayout,
},
];
