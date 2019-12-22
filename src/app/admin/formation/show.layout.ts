import {SubNavBar} from "components/sub-nav-bar";
import Api from "modules/Api/Api.module";
import {Formation} from "modules/Api/Model/Formation";
import Vue from "vue";
import Component from "vue-class-component";
import {Watch} from "vue-property-decorator";
import {Store} from "../_store";
import {formationRoutes} from "./_routes.show";
import WithRender from "./show.layout.html";

export {formationRoutes};

@WithRender
@Component({components: {SubNavBar}})
export class FormationShow extends Vue {

  public formation: Formation = null;
  public navBarData: SubNavBar["data"] = {
    routes: formationRoutes,
    label: "",
  };

  @Watch("$route", {immediate: true, deep: true})
  public on$routeChange(newVal: any) {
    Api.formationService.getByIdentifier$(this.$route.params.identifier).subscribe((formation: Formation) => {
      Store.formation_.next(formation);
      this.formation = formation;
      this.navBarData.label = formation.label;
    });
  }
}

