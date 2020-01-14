import InputClearable from "components/forms/input-clearable";
import {SubNavBar} from "components/sub-nav-bar";
import {Component, Vue, VueComponent} from "shared/vue";
import {RouteConfig} from "vue-router";
import WithRender from "./absences-module.layout.html";
import {AbsencesLayout} from "./absences/absences.layout";
import {DelaysLayout} from "./delays/delays.layout";
import {SynthesisLayout} from "./synthesis/synthesis.layout";

export const absencesRoutes: RouteConfig[] = [
  {
    path: "index",
    meta: {
      label: "Absences",
      icon: "fa-ban",
    },
    component: AbsencesLayout,
  }, {
    path: "delays",
    meta: {
      label: "Retards",
      icon: "fa-clock-o",
    },
    component: DelaysLayout,
  }, {
    path: "synthesis",
    meta: {
      label: "Récapitulatif",
      icon: "fa-list",
    },
    component: SynthesisLayout,
  },
];

@WithRender
@Component({components: {InputClearable, SubNavBar}})
export class AbsencesModuleLayout extends Vue implements VueComponent {
  public navBarData: SubNavBar["data"] = {
    routes: absencesRoutes,
    label: "Absences & retards",
  };
}
