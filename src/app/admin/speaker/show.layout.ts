import {SubNavBar} from "components/sub-nav-bar";
import Api from "modules/Api/Api.module";
import {Speaker} from "modules/Api/Model/Speaker";
import Vue from "vue";
import Component from "vue-class-component";
import {Watch} from "vue-property-decorator";
import {Store} from "../_store";
import {speakerRoutes} from "./_routes.show";
import WithRender from "./show.layout.html";

@WithRender
@Component({
  components: {},
})
export class SpeakerShow extends Vue {
  public speaker: Speaker = null;
  public navBarData: SubNavBar["data"] = {
    routes: speakerRoutes,
    label: "",
  };

  @Watch("$route", {immediate: true, deep: true})
  public on$routeChange(newVal: any) {
    Api.speakerService.getByIdentifier$(this.$route.params.identifier).subscribe((speaker: Speaker) => {
      Store.speaker_.next(speaker);
      this.speaker = speaker;
      this.navBarData.label = speaker.label;
    });
  }
}

