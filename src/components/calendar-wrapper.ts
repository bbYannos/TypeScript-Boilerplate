import {OptionsInput} from "@fullcalendar/core/types/input-types";
import {calendarModule$} from "modules/Calendar";
import {Observable, of, Subject} from "rxjs";
import moment from "shared/moment";
import Vue from "vue";
import Component from "vue-class-component";
import {routerAuthService} from "../app/routes/router";
import {Session} from "../modules/Api/Model/Session/Session.Model";
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
      const planningComponent = new module.FullCalendar();
      const calendarParams: OptionsInput = module.CalendarFactory.getCalendarRangeForSpeaker();
      calendarParams.header = {left: "prev,next", center: "title", right: ""};
      calendarParams.eventRender = (info) => module.CalendarFactory.formatSession(info, (session: Session) => {
        console.log(session);
        if (session.training.formation) {
          return session.training.formation.label;
        }
        return "";
      });
      routerAuthService.user.speaker.sessions$.subscribe((sessions) => {
        console.log(sessions);
      });
      planningComponent.getAllEvents$ = () => of([]);
      console.log(routerAuthService.user.speaker);
      /*
      planningComponent.getAllEvents$ = (info) => {
        const options = {
          startTime: moment(info.start),
          endTime: moment(info.end),
          sessions$: routerAuthService.user.speaker.sessions$,
        };
        return module.CalendarFactory.makeSessionsCalendarSource$(options);
      };
      */
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
