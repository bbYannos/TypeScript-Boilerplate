import {OptionsInput} from "@fullcalendar/core/types/input-types";
import {CalendarComponent} from "components/wrappers/calendar.component";
import {Availability} from "modules/Api/Model/Availability";
import {Formation} from "modules/Api/Model/Formation";
import {CalendarFactoryOptions} from "modules/Calendar/Calendar.Factory";
import {TIME_FULL_CALENDAR} from "modules/Calendar/Constants";
import {CalendarFactory} from "modules/Calendar/module";
import {MODULES_CONSTANTS} from "modules/modules.constants";
import {switchMap, tap} from "rxjs/operators";
import moment from "shared/moment";
import {ObjectUtils} from "shared/utils/object.utils";
import {Store} from "../../_store";

export class ProvisionalCalendar extends CalendarComponent<Availability> {

  protected overrideOptions: OptionsInput = {
    defaultView: "timeGridWeek",
    header: {left: "prev,next", center: "title", right: ""},
  };

  protected formation: Formation = null;
  public render() {
    this.component.getAllEvents$ = (info: any) => Store.formation_.pipe(
      tap((formation: Formation) => {
        this.component.mutateOptions(this.getRange(formation));
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

  protected getRange(formation: Formation): OptionsInput {
    const formationStart = (ObjectUtils.isValidMoment(formation.startTime)) ? formation.startTime : null;
    const formationEnd = (ObjectUtils.isValidMoment(formation.endTime)) ? formation.endTime : null;
    return {
      minTime: ((ObjectUtils.isValidMoment(formation.hourMin)) ? formation.hourMin : MODULES_CONSTANTS.SCHEDULE.OPENING).format(TIME_FULL_CALENDAR),
      maxTime: ((ObjectUtils.isValidMoment(formation.hourMax)) ? formation.hourMax : MODULES_CONSTANTS.SCHEDULE.CLOSING).format(TIME_FULL_CALENDAR),
      validRange: {
        start: formationStart.toDate(),
        end: formationEnd.toDate(),
      },
    };
  }
}

export default ProvisionalCalendar;
