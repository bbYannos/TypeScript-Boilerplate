import {OptionsInput} from "@fullcalendar/core/types/input-types";
import {Session} from "modules/Api/Model/Session";
import {CalendarFactory, FullCalendar} from "modules/Calendar/module";
import {Observable} from "rxjs";
import moment from "shared/moment";
import {routerAuthService} from "../routes/router";

export class TraineeCalendar {
  public close$: Observable<any> = null;
  public $htmEl: HTMLElement = null;

  public render() {
    const planningComponent = new FullCalendar(this.close$);
    const trainee = routerAuthService.user.trainee;
    const calendarParams: OptionsInput =  CalendarFactory.getCalendarRangeForTrainee(trainee);
    calendarParams.header = {left: "prev,next", center: "title", right: ""};
    calendarParams.eventRender = (info) => CalendarFactory.formatSession(info, (session: Session) => session.training.formation.label);
    planningComponent.getAllEvents$ = (info) => {
      const options = {
        startTime: moment(info.start),
        endTime: moment(info.end),
        sessions$: trainee.formation.sessions$,
      };
      return CalendarFactory.makeSessionsCalendarSource$(options);
    };
    planningComponent.$htmEl = this.$htmEl as HTMLElement;
    planningComponent.close$ = this.close$;
    planningComponent.render(calendarParams);
  }
}

export default {CalendarComponent: TraineeCalendar};
