import {OptionsInput} from "@fullcalendar/core/types/input-types";
import {CalendarComponent} from "components/calendar/calendar.component";
import Api from "modules/Api/Api.module";
import {Session} from "modules/Api/Model/Session";
import {Speaker} from "modules/Api/Model/Speaker";
import {CalendarFactory} from "modules/Calendar/module";
import {of} from "rxjs";
import {switchMap, tap} from "rxjs/operators";
import moment from "shared/moment";
import {Store} from "../../_store";

export class SpeakerCalendar extends CalendarComponent<Session> {
  protected overrideOptions: OptionsInput = {
    header: {left: "prev,next", center: "title", right: ""},
  };

  public render() {
    this.overrideOptions = {...this.overrideOptions, ...CalendarFactory.getCalendarRangeForSpeaker(Api.formationService)};
    this.component.getAllEvents$ = (info) => {
      const options = {
        startTime: moment(info.start),
        endTime: moment(info.end),
        events$: Store.speaker_.pipe(switchMap((speaker: Speaker) => speaker.sessions$)),
        vacations$: Api.availabilityService.globalVacations$,
      };
      return CalendarFactory.makeSessionsCalendarSource$(options).pipe(
        tap(() => this.loading_.next(false)),
      );
    };
    super.render();
  }

  public eventAfterRender: (data) => void = (data) => CalendarFactory.formatSession(data, (session: Session) => {
    if (session.training.formation) {
      return session.training.formation.label;
    }
    return session.apiId.toString();
  });
}

export default SpeakerCalendar;
