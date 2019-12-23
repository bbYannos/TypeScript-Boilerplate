import Api from "modules/Api/Api.module";
import {Formation} from "modules/Api/Model/Formation";
import {formationRoutes} from "./_routes.show";
import {FormationsList} from "./list.layout";
import {FormationShow} from "./show.layout";

// Cache on sub route
let currentRoute = formationRoutes[0].path;
formationRoutes.forEach((_route) => {
  _route.beforeEnter = (to, from, next) => {
    currentRoute = _route.path;
    next();
  };
});

export const formationRoute = {
  path: ":identifier/",
  name: "Formation",
  redirect: () => {
    return ":identifier/" + currentRoute;
  },
  component: FormationShow,
  meta: {
    elements: [],
  },
  children: formationRoutes,
};

export const formationsRoute = {
  path: "/formations", name: "Formations", redirect: "/formations/list",
  meta: {icon: "fa-leanpub"},
  component: {template: "<router-view />"},
  children: [
    {path: "list", name: "FormationsList", component: FormationsList},
    formationRoute,
  ],
};

Api.formationService.fetchAll$.subscribe((formations: Formation[]) => {
  formationRoute.meta.elements = formations.filter((formation) => formation.label !== "");
});
