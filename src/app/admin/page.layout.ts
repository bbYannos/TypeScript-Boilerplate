import "assets/_main";
import {CalendarWrapper} from "components/calendar-wrapper";
import {CardComponent} from "components/card";
import {AdminPageLayout} from "layouts/admin-page";
import Vue from "vue";
import Component from "vue-class-component";
import WithRender from "./page.layout.html";

@WithRender
@Component({
  components: {AdminPageLayout, CardComponent, CalendarWrapper},
})
export class SpeakerPageLayout extends Vue {
  public mounted() {
  }
}
export default Vue.component("speaker-page-layout", SpeakerPageLayout);



