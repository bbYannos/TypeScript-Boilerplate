import {RouteConfig} from "vue-router";
import {AbsencesLayout} from "./absences/absences.layout";
import {ScoresLayout} from "./scores/scores.layout";

export const traineeRoutes: RouteConfig[] = [
  {
    path: "scores",
    meta: {
      label: "Notes",
      icon: "fa-star-o",
    },
    component: ScoresLayout,
  }, {
    path: "absences",
    meta: {
      label: "Absences",
      icon: "fa-clock-o",
    },
    component: AbsencesLayout,
  },
];
