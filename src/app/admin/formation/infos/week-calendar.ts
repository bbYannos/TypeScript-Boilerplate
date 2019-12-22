import {OptionsInput} from "@fullcalendar/core/types/input-types";
import Api from "modules/Api/Api.module";
import {AvailabilityQuery} from "modules/Api/Model/Availability/Availability.Service";
import {Formation} from "modules/Api/Model/Formation";
import {TIME_FULL_CALENDAR} from "modules/Calendar/Constants";
import {EditableFullCalendar} from "modules/Calendar/module";
import {MODULES_CONSTANTS} from "modules/modules.constants";
import {Observable} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {getTemplateDay} from "shared/moment";
import {ObjectUtils} from "shared/utils/object.utils";
import {Store} from "../_store";

export class ProvisionalCalendar {
  public close$: Observable<any> = null;
  public $htmEl: HTMLElement = null;

  protected getCalendarParams(formation: Formation): OptionsInput {
    return {
      minTime: ((ObjectUtils.isValidMoment(formation.hourMin)) ? formation.hourMin : MODULES_CONSTANTS.SCHEDULE.OPENING).format(TIME_FULL_CALENDAR),
      maxTime: ((ObjectUtils.isValidMoment(formation.hourMax)) ? formation.hourMax : MODULES_CONSTANTS.SCHEDULE.CLOSING).format(TIME_FULL_CALENDAR),
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
    Store.formation_.pipe(takeUntil(this.close$)).subscribe((formation: Formation) => {
      query.setParentAndClass(formation);
      calendarComponent.setSource$(formation.availabilities$);
      calendarComponent.render(this.getCalendarParams(formation));
    });
  }
}

export default ProvisionalCalendar;
