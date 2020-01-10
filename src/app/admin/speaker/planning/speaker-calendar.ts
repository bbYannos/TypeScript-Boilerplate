import Api from "modules/Api/Api.module";
import {Session} from "modules/Api/Model/Session";
import {Speaker} from "modules/Api/Model/Speaker";
import {CalendarFactory, FullCalendar} from "modules/Calendar/module";
import {Observable} from "rxjs";
import {switchMap} from "rxjs/operators";
import moment from "shared/moment";
import {Store} from "../../_store";

export class SpeakerCalendar {
  public close$: Observable<any> = null;
  public $htmEl: HTMLElement = null;

  public render() {
    const planningComponent = new FullCalendar(this.close$);
    planningComponent.$htmEl = this.$htmEl as HTMLElement;
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
        sessions$: Store.speaker_.pipe(switchMap((speaker: Speaker) => speaker.sessions$)),
        vacations$: Api.availabilityService.globalVacations$,
      };
      return CalendarFactory.makeSessionsCalendarSource$(options);
    };
    planningComponent.render(calendarParams);
  }
}

export default SpeakerCalendar;
