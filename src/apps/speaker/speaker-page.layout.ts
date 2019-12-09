import {OptionsInput} from "@fullcalendar/core/types/input-types";
import {CardComponent} from "components/card";
import {NullComponent} from "components/null";
import {MainPageLayout} from "layouts/main-page";
import {calendarModule$} from "modules/Calendar";
import {of, Subject} from "rxjs";
import Vue from "vue";
import Component from "vue-class-component";
import {Session} from "../../modules/Api/Model/Session.Model";
import {FullCalendar} from "../../modules/Calendar/FullCalendar";
import WithRender from "./speaker-page.layout.html";

@WithRender
@Component({
  components: {MainPageLayout, CardComponent, NullComponent},
})
export class SpeakerPageLayout extends Vue {
  public $refs: {planning?: Vue} = {};
  protected close_: Subject<void> = new Subject<void>();
  public planningCard: CardComponent["data"] = {
    label: "Planning",
    loading: true,
  };

  // noinspection JSUnusedGlobalSymbols
  public mounted() {
    calendarModule$.subscribe((module) => {
      this.planningCard.loading = false;
      this.$nextTick(() => {
        const planningComponent: FullCalendar = new module.FullCalendar();
        const calendarParams: OptionsInput =  module.CalendarFactory.getCalendarRangeForSpeaker();
        calendarParams.header =  {left: "prev,next", center: "title", right: ""};
        calendarParams.eventRender = (info) => module.CalendarFactory.formatSession(info, (session: Session) => session.training.formation.label);
        planningComponent.$htmEl = this.$refs.planning.$el as HTMLElement;
        planningComponent.close$ = this.close_;
        planningComponent.getAllEvents$ = () => of([]);
        planningComponent.render(calendarParams);
      });
    });
  }

  // noinspection JSUnusedGlobalSymbols
  public beforeDestroy() {
    this.close_.next();
    this.close_.complete();
  }
}

export default Vue.component("speaker-page-layout", SpeakerPageLayout);



