import {RouteConfig} from "vue-router";
import {AbsencesLayout} from "./absences/absences.layout";
import {ScoresLayout} from "./scores/scores.layout";

export const traineeRoutes: RouteConfig[] = [{
  path: "scores", name: "Notes",
  meta: {icon: "fa-star-o"},
  component: ScoresLayout,
}, {
  path: "absences", name: "Absences",
  meta: {icon: "fa-clock-o"},
  component: AbsencesLayout,
},
];
