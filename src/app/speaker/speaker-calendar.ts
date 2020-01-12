import {CalendarComponent} from "components/calendar/calendar.component";
import Api from "modules/Api/Api.module";
import {Session} from "modules/Api/Model/Session";
import {CalendarFactory} from "modules/Calendar/module";
import moment from "shared/moment";
import {CalendarFactoryOptions} from "../../modules/Calendar/Calendar.Factory";
import {routerAuthService} from "../routes/router";

export class SpeakerCalendar extends CalendarComponent<Session> {
  public render() {
    const speaker = routerAuthService.user.speaker;
    this.overrideOptions = CalendarFactory.getCalendarRangeForSpeaker(Api.formationService);
    this.overrideOptions.header = {left: "prev,next", center: "title", right: ""};
    this.overrideOptions.eventRender = (info) => CalendarFactory.formatSession(info, (session: Session) => {
      if (session.training.formation) {
        return session.training.formation.label;
      }
      return session.apiId.toString();
    });
    this.component.getAllEvents$ = (info) => {
      const options: CalendarFactoryOptions = {
        startTime: moment(info.start),
        endTime: moment(info.end),
        events$: speaker.sessions$,
      };
      return CalendarFactory.makeSessionsCalendarSource$(options);
    };
    super.render();
  }
}

export default {CalendarComponent: SpeakerCalendar};
