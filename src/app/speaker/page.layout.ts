import "assets/_user";
import {CalendarWrapper} from "components/calendar-wrapper";
import {CardComponent} from "components/card";
import {MainPageLayout} from "layouts/main-page";
import {from} from "rxjs";
import Vue from "vue";
import Component from "vue-class-component";
import WithRender from "./page.layout.html";

@WithRender
@Component({
  components: {MainPageLayout, CardComponent, CalendarWrapper},
})
export class SpeakerPageLayout extends Vue {
  public planningCard: CardComponent["data"] = {
    label: "Planning",
    loading: false,
  };

  public calendarComponent$ = () => from(import(/* webpackChunkName: "speaker" */ "./speaker-calendar"));
}
export default Vue.component("speaker-page-layout", SpeakerPageLayout);



