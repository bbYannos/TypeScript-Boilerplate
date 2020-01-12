import {OptionsInput} from "@fullcalendar/core/types/input-types";
import {CalendarComponent} from "components/calendar/calendar.component";
import {Availability} from "modules/Api/Model/Availability";
import {Formation} from "modules/Api/Model/Formation";
import {CalendarFactoryOptions} from "modules/Calendar/Calendar.Factory";
import {CalendarFactory} from "modules/Calendar/module";
import {switchMap, tap} from "rxjs/operators";
import moment from "shared/moment";
import {Store} from "../../_store";

export class ProvisionalCalendar extends CalendarComponent<Availability> {

  protected overrideOptions: OptionsInput = {
    defaultView: "timeGridWeek",
    header: {left: "prev,next", center: "title", right: ""},
  };

  public render() {
    this.component.getAllEvents$ = (info: any) => Store.formation_.pipe(
      tap((formation: Formation) => {
        this.component.mutateOptions(CalendarFactory.getRangeByFormation(formation));
      }),
      switchMap((formation: Formation) => {
        const startTime = moment(info.start).startOf("week");
        const endTime = moment(info.start).clone().endOf("week");
        const options: CalendarFactoryOptions = {
          startTime: startTime,
          endTime: endTime,
          availableSessions$: formation.availableSessions$(startTime, endTime),
          vacations$: formation.allVacations$,
        };
        return CalendarFactory.makeSessionsCalendarSource$(options).pipe(
          tap(() => this.loading_.next(false)),
        );
      }),
    );
    super.render();
  }
}

export default ProvisionalCalendar;
