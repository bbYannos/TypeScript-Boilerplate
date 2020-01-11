import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import moment from "shared/moment";
import {ObjectUtils} from "shared/utils/object.utils";
import {EventInterface} from "./Interface/Event.Interface";

export class EventMapperOptions {
  public startTime: moment.Moment = null;
  public endTime: moment.Moment = null;
  public background: boolean = false;
  public open: boolean = true;
}

// tslint:disable-next-line
export class EventMapper {
  public static getEvents$AsCalendarEvents$<T extends EventInterface>(events$: Observable<T[]>, options: EventMapperOptions): Observable<any[]> {
    if (options.startTime !== null && options.endTime !== null) {
      events$ = this.filterEvents$ByPeriod(events$, options.startTime, options.endTime);
    }
    return events$.pipe(map((events: T[]) => events
      .filter((event) => ObjectUtils.isValidMoment(event.startTime) && ObjectUtils.isValidMoment(event.endTime))
      .map((event: T) => (options.background) ? EventMapper.objectToBackgroundEvent(event, options) : EventMapper.objectToEvent(event)),
    ));
  }

  public static objectToEvent(object: EventInterface) {
    if (!ObjectUtils.isValidMoment(object.startTime) || !ObjectUtils.isValidMoment(object.endTime)) {
      return null;
    }
    return {
      title: object.label,
      start: object.startTime.toDate(),
      end: object.endTime.toDate(),
      allDay: false,
      color: object.color,
      extendedProps: {apiObject: object},
    };
  }

  public static objectToBackgroundEvent(object: EventInterface, options: EventMapperOptions) {
    if (!ObjectUtils.isValidMoment(object.startTime) || !ObjectUtils.isValidMoment(object.endTime)) {
      return null;
    }
    return {
      start: object.startTime.toDate(),
      // if closed day, adjust end to next midnight
      end: (options.open) ? object.endTime.toDate() : object.endTime.add(1, "day").startOf("day").toDate(),
      rendering: "background",
      className: (options.open) ? "fc-bg-event-availability" : "fc-bg-event-vacancy",
      overlap: options.open,
    };
  }

  public static eventToObject<T extends EventInterface>(event): T {
    return event.extendedProps.apiObject;
  }

  public static filterEvents$ByPeriod<T extends EventInterface>(event$: Observable<T[]>, startTime: moment.Moment, endTime: moment.Moment): Observable<T[]> {
    return event$.pipe(map(
      (events: T[]) => events.filter(
        (event: T) => (!endTime.isBefore(event.startTime) && !startTime.isAfter(event.endTime)),
      )));
  }
}
