import Vue from "vue";
import Component from "vue-class-component";
import {Watch} from "vue-property-decorator";
import {SubNavBar} from "../../../components/sub-nav-bar";
import Api from "../../../modules/Api/Api.module";
import {Trainee} from "../../../modules/Api/Model/Trainee";
import {Store} from "../_store";
import {traineeRoutes} from "./_routes.show";
import WithRender from "./show.layout.html";

@WithRender
@Component({
  components: {},
})
export class TraineeShow extends Vue {

  public trainee: Trainee = null;
  public navBarData: SubNavBar["data"] = {
    routes: traineeRoutes,
    label: "",
  };

  @Watch("$route", {immediate: true, deep: true})
  public on$routeChange(newVal: any) {
    Api.traineeService.getByIdentifier$(this.$route.params.identifier).subscribe((trainee: Trainee) => {
      Store.trainee_.next(trainee);
      this.trainee = trainee;
      this.navBarData.label = trainee.label;
    });
  }
}

