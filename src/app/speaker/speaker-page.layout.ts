import {CalendarWrapper} from "components/calendar-wrapper";
import {CardComponent} from "components/card";
import {MainPageLayout} from "layouts/main-page";
import Vue from "vue";
import Component from "vue-class-component";
import WithRender from "./speaker-page.layout.html";

@WithRender
@Component({
  components: {MainPageLayout, CardComponent, CalendarWrapper},
})
export class SpeakerPageLayout extends Vue {
  public planningCard: CardComponent["data"] = {
    label: "Planning",
    loading: false,
  };
}
export default Vue.component("speaker-page-layout", SpeakerPageLayout);



