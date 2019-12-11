import "assets/_user";
import {CalendarWrapper} from "components/calendar-wrapper";
import {CardComponent} from "components/card";
import {MainPageLayout} from "layouts/main-page";
import Vue from "vue";
import Component from "vue-class-component";
import {routerAuthService} from "../routes/router";
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

  public mounted() {
    console.log(routerAuthService.user.speaker);
    /*
    planningComponent.getAllEvents$ = (info) => {
      const options: CalendarFactoryOptions = {
        startTime: moment(info.start),
        endTime: moment(info.end),
        sessions$: speaker.sessions$,
      };
      return CalendarFactory.makeSessionsCalendarSource$(options);
    };
     */
  }
}
export default Vue.component("speaker-page-layout", SpeakerPageLayout);



