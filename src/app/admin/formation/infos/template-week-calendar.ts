import {OptionsInput} from "@fullcalendar/core/types/input-types";
import {CalendarComponent} from "components/wrappers/calendar.component";
import Api from "modules/Api/Api.module";
import {Availability, AvailabilityQuery} from "modules/Api/Model/Availability/Availability.Service";
import {Formation} from "modules/Api/Model/Formation";
import {CalendarFactoryOptions} from "modules/Calendar/Calendar.Factory";
import {TIME_FULL_CALENDAR} from "modules/Calendar/Constants";
import {CalendarFactory} from "modules/Calendar/module";
import {MODULES_CONSTANTS} from "modules/modules.constants";
import {switchMap, tap} from "rxjs/operators";
import moment, {getTemplateDay} from "shared/moment";
import {ObjectUtils} from "shared/utils/object.utils";
import {Store} from "../../_store";

export class TemplateWeekCalendar extends CalendarComponent<Availability> {
  protected overrideOptions: OptionsInput = {
    defaultView: "timeGridWeek",
    header: {left: "", center: "", right: ""},
  };

  protected query: AvailabilityQuery = null;

  protected static getTemplateRangeByFormation(formation: Formation): OptionsInput {
    return {
      minTime: ((ObjectUtils.isValidMoment(formation.hourMin)) ? formation.hourMin : MODULES_CONSTANTS.SCHEDULE.OPENING).format(TIME_FULL_CALENDAR),
      maxTime: ((ObjectUtils.isValidMoment(formation.hourMax)) ? formation.hourMax : MODULES_CONSTANTS.SCHEDULE.CLOSING).format(TIME_FULL_CALENDAR),
      validRange: {
        start: getTemplateDay(1).toDate(),
        end: getTemplateDay(6).toDate()
      },
    };
  }

  public render() {
    this.service = Api.availabilityService;
    this.query = new AvailabilityQuery();
    this.query.open = true;

    this.component.getAllEvents$ = (info: any) => Store.formation_.pipe(
      tap((formation: Formation) => {
        this.query.setParentAndClass(formation);
        this.component.mutateOptions(TemplateWeekCalendar.getTemplateRangeByFormation(formation));
      }),
      switchMap((formation: Formation) => {
        const startTime = moment(info.start).startOf("week");
        const endTime = moment(info.start).clone().endOf("week");
        const options: CalendarFactoryOptions = {
          startTime: startTime,
          endTime: endTime,
          sessions$: formation.availabilities$,
        };
        return CalendarFactory.makeSessionsCalendarSource$(options).pipe(
          tap(() => this.loading_.next(false)),
        );
      }),
    );
    super.render();
  }
}

export default TemplateWeekCalendar;
