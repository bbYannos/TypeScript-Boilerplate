import {OptionsInput} from "@fullcalendar/core/types/input-types";
import Api from "modules/Api/Api.module";
import {AvailabilityQuery} from "modules/Api/Model/Availability/Availability.Service";
import {Speaker} from "modules/Api/Model/Speaker";
import {TIME_FULL_CALENDAR} from "modules/Calendar/Constants";
import {EditableFullCalendar} from "modules/Calendar/module";
import {Observable} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {getTemplateDay} from "shared/moment";
import {Store} from "../../_store";

export class ProvisionalCalendar {
  public close$: Observable<any> = null;
  public $htmEl: HTMLElement = null;

  protected getCalendarParams(): OptionsInput {
    return {
      minTime: Api.formationService.hourMin.format(TIME_FULL_CALENDAR),
      maxTime: Api.formationService.hourMax.format(TIME_FULL_CALENDAR),
      validRange: {
        start: getTemplateDay(1).toDate(),
        end: getTemplateDay(6).toDate()
      }
    };
  }

  public render() {
    const calendarComponent = new EditableFullCalendar(this.close$);
    calendarComponent.$htmEl = this.$htmEl as HTMLElement;
    calendarComponent.close$ = this.close$;
    calendarComponent.service = Api.availabilityService;
    const query = new AvailabilityQuery();
    query.open = true;
    calendarComponent.query = query;
    Store.speaker_.pipe(takeUntil(this.close$)).subscribe((speaker: Speaker) => {
      query.setParentAndClass(speaker);
      calendarComponent.setSource$(speaker.availabilities$);
      calendarComponent.render(this.getCalendarParams());
    });
  }
}

export default ProvisionalCalendar;
