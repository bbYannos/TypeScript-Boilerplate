import {traineeRoutes} from "./_routes.show";
import {TraineesList} from "./list.layout";
import {TraineeShow} from "./show.layout";

export const traineeRoute = {
  path: ":identifier/",
  name: "Etudiant",
  redirect: () => {
    return ":identifier/" + traineeRoutes.concat().shift().path;
  },
  component: TraineeShow,
  meta: {
    elements: [],
  },
  children: traineeRoutes,
};

export const traineesRoute = {
  path: "/students", redirect: "/students/list",
  meta: {
    label: "Étudiants",
    icon: "fa-graduation-cap",
  },
  component: {template: "<router-view />"},
  children: [
    {path: "list", name: "StudentsList", component: TraineesList},
    traineeRoute,
  ],
};

