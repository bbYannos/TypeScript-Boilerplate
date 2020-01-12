import {OptionsInput} from "@fullcalendar/core/types/input-types";
import {CalendarComponent} from "components/calendar/calendar.component";
import Api from "modules/Api/Api.module";
import {Availability, AvailabilityQuery} from "modules/Api/Model/Availability/Availability.Service";
import {Speaker} from "modules/Api/Model/Speaker";
import {CalendarFactoryOptions} from "modules/Calendar/Calendar.Factory";
import {TIME_FULL_CALENDAR} from "modules/Calendar/Constants";
import {CalendarFactory} from "modules/Calendar/module";
import {switchMap, tap} from "rxjs/operators";
import moment, {getTemplateDay} from "shared/moment";
import {Store} from "../../_store";

export class TemplateWeekCalendar extends CalendarComponent<Availability> {
  protected overrideOptions: OptionsInput = {
    defaultView: "timeGridWeek",
    header: {left: "", center: "", right: ""},
  };

  protected editable = true;
  protected service =  Api.availabilityService;
  protected query: AvailabilityQuery = new AvailabilityQuery();

  protected static getTemplateRange(): OptionsInput {
    return {
      minTime: Api.formationService.hourMin.format(TIME_FULL_CALENDAR),
      maxTime: Api.formationService.hourMax.format(TIME_FULL_CALENDAR),
      validRange: {
        start: getTemplateDay(1).toDate(),
        end: getTemplateDay(6).toDate(),
      },
    };
  }

  public render() {
    this.query.open = true;
    this.overrideOptions = {...this.overrideOptions, ...TemplateWeekCalendar.getTemplateRange()};
    this.component.getAllEvents$ = (info: any) => Store.speaker_.pipe(
      tap((speaker: Speaker) => this.query.setParentAndClass(speaker)),
      switchMap((speaker: Speaker) => {
        const startTime = moment(info.start).startOf("week");
        const endTime = moment(info.start).clone().endOf("week");
        const options: CalendarFactoryOptions = {
          startTime: startTime,
          endTime: endTime,
          events$: speaker.availabilities$,
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
