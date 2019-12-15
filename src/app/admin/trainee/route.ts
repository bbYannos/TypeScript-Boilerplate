import {TraineesList} from "./list.layout";
import {TraineeShow} from "./show.layout";

export const traineesRoute = {
  path: "/students", name: "Étudiants", redirect: "/students/list",
  meta: {icon: "fa-graduation-cap"},
  component: {template: "<router-view />"},
  children: [
    {path: "list", name: "StudentsList", component: TraineesList},
    {
      path: ":identifier",
      name: "Étudiant",
      component: TraineeShow,
    }
  ],
};
