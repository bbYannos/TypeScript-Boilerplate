import {OptionsInput} from "@fullcalendar/core/types/input-types";
import {Formation} from "modules/Api/Model/Formation";
import {CalendarFactoryOptions} from "modules/Calendar/Calendar.Factory";
import {TIME_FULL_CALENDAR} from "modules/Calendar/Constants";
import {CalendarFactory, FullCalendar} from "modules/Calendar/module";
import {MODULES_CONSTANTS} from "modules/modules.constants";
import {Observable} from "rxjs";
import {takeUntil} from "rxjs/operators";
import moment from "shared/moment";
import {ObjectUtils} from "shared/utils/object.utils";
import {Store} from "../_store";

export class ProvisionalCalendar {
  public close$: Observable<any> = null;
  public $htmEl: HTMLElement = null;

  protected getCalendarParams(formation: Formation): OptionsInput {
    const formationStart = (ObjectUtils.isValidMoment(formation.startTime)) ? formation.startTime : null;
    const formationEnd = (ObjectUtils.isValidMoment(formation.endTime)) ? formation.endTime : null;
    let start = formationStart;
    if (moment().isAfter(formationStart)) {
      start = moment();
    }
    return {
      defaultView: "timeGridWeek",
      defaultDate: start.toDate(),
      minTime: ((ObjectUtils.isValidMoment(formation.hourMin)) ? formation.hourMin : MODULES_CONSTANTS.SCHEDULE.OPENING).format(TIME_FULL_CALENDAR),
      maxTime: ((ObjectUtils.isValidMoment(formation.hourMax)) ? formation.hourMax : MODULES_CONSTANTS.SCHEDULE.CLOSING).format(TIME_FULL_CALENDAR),
      header: {left: "prev,next", center: "title", right: ""},
      validRange: {
        start: formationStart.toDate(),
        end: formationEnd.toDate(),
      },
    };
  }

  public render() {
    const planningComponent = new FullCalendar(this.close$);
    planningComponent.$htmEl = this.$htmEl as HTMLElement;
    planningComponent.close$ = this.close$;
    Store.formation_.pipe(takeUntil(this.close$)).subscribe((formation: Formation) => {
      planningComponent.getAllEvents$ = (info: any) => {
        const startTime = moment(info.start).startOf("week");
        const endTime = moment(info.start).clone().endOf("week");
        const options: CalendarFactoryOptions = {
          startTime: startTime,
          endTime: endTime,
          availableSessions$: formation.availableSessions$(startTime, endTime),
          vacations$: formation.allVacations$,
        };
        return CalendarFactory.makeSessionsCalendarSource$(options);
      };
      planningComponent.render(this.getCalendarParams(formation));
    });
  }
}

export default ProvisionalCalendar;
