import {SubNavBar} from "components/sub-nav-bar";
import Api from "modules/Api/Api.module";
import {Formation} from "modules/Api/Model/Formation";
import Vue from "vue";
import Component from "vue-class-component";
import {Watch} from "vue-property-decorator";
import WithRender from "./show.layout.html";
import {formationRoutes} from "./show.routes";

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
  public onUrlChange(newVal: any) {
    Api.formationService.getByIdentifier$(this.$route.params.identifier).subscribe((formation: Formation) => {
      this.formation = formation;
      this.navBarData.label = formation.label;
    });
  }
}

