import Api from "modules/Api/Api.module";
import {Session} from "modules/Api/Model/Session";
import {CalendarFactory, FullCalendar} from "modules/Calendar/module";
import {Observable} from "rxjs";
import moment from "shared/moment";
import {routerAuthService} from "../routes/router";

export class SpeakerCalendar {
  public close$: Observable<any> = null;
  public $htmEl: HTMLElement = null;

  public render() {
    const planningComponent = new FullCalendar(this.close$);
    const calendarParams = CalendarFactory.getCalendarRangeForSpeaker(Api.formationService);
    calendarParams.header = {left: "prev,next", center: "title", right: ""};
    calendarParams.eventRender = (info) => CalendarFactory.formatSession(info, (session: Session) => {
      if (session.training.formation) {
        return session.training.formation.label;
      }
      return session.apiId.toString();
    });
    planningComponent.getAllEvents$ = (info) => {
      const options = {
        startTime: moment(info.start),
        endTime: moment(info.end),
        sessions$: routerAuthService.user.speaker.sessions$,
      };
      return CalendarFactory.makeSessionsCalendarSource$(options);
    };
    planningComponent.$htmEl = this.$htmEl as HTMLElement;
    planningComponent.close$ = this.close$;
    planningComponent.render(calendarParams);
  }
}

export default {CalendarComponent: SpeakerCalendar};
