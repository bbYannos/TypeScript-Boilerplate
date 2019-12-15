import Api from "modules/Api/Api.module";
import {Formation} from "modules/Api/Model/Formation";
import {FormationsList} from "./list.layout";
import {FormationShow} from "./show.layout";

const formationRoute = {
  path: ":identifier",
  name: "Formation",
  component: FormationShow,
  meta: {
    elements: [],
  },
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
  formationRoute.meta.elements = formations;
});
