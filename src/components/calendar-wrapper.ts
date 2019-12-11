import {OptionsInput} from "@fullcalendar/core/types/input-types";
import {Observable, of, Subject} from "rxjs";
import Vue from "vue";
import Component from "vue-class-component";
import {Session} from "../modules/Api/Model/Session/Session.Model";
import {calendarModule$} from "../modules/Calendar";
import {FullCalendar} from "../modules/Calendar/FullCalendar";
import WithRender from "./calendar-wrapper.html";

interface ModuleComponent {
  close$: Observable<void>;
  $htmEl: HTMLElement;

  render(...param): void;
}

@WithRender
@Component
export class CalendarWrapper extends Vue {
  public $refs: { target?: HTMLElement } = {};
  public data: { loading: boolean } = {loading: true};

  protected close_: Subject<void> = new Subject<void>();

  // noinspection JSUnusedGlobalSymbols
  public mounted() {
    calendarModule$.subscribe((module) => {
      this.data.loading = false;
      const planningComponent: FullCalendar = new module.FullCalendar();
      const calendarParams: OptionsInput = module.CalendarFactory.getCalendarRangeForSpeaker();
      calendarParams.header = {left: "prev,next", center: "title", right: ""};
      calendarParams.eventRender = (info) => module.CalendarFactory.formatSession(info, (session: Session) => session.training.formation.label);
      planningComponent.getAllEvents$ = () => of([]);

      planningComponent.$htmEl = this.$refs.target as HTMLElement;
      planningComponent.close$ = this.close_;
      planningComponent.render(calendarParams);
    });
  }

  // noinspection JSUnusedGlobalSymbols
  public beforeDestroy() {
    this.close_.next();
    this.close_.complete();
  }
}

export default Vue.component("calendar-w", CalendarWrapper);
