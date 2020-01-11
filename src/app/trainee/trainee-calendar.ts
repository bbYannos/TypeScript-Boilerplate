import {CalendarComponent} from "components/wrappers/calendar.component";
import {Session} from "modules/Api/Model/Session";
import {CalendarFactory} from "modules/Calendar/module";
import moment from "shared/moment";
import {routerAuthService} from "../routes/router";

export class TraineeCalendar extends CalendarComponent<Session> {
  public render() {
    const trainee = routerAuthService.user.trainee;
    this.overrideOptions = CalendarFactory.getCalendarRangeForTrainee(trainee);
    this.overrideOptions.header = {left: "prev,next", center: "title", right: ""};
    this.overrideOptions.eventRender = (info) => CalendarFactory.formatSession(info, (session: Session) => session.training.formation.label);
    this.component.getAllEvents$ = (info) => {
      const options = {
        startTime: moment(info.start),
        endTime: moment(info.end),
        sessions$: trainee.formation.sessions$,
      };
      return CalendarFactory.makeSessionsCalendarSource$(options);
    };
    super.render();
  }
}

export default TraineeCalendar;
