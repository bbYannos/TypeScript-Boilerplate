import {OptionsInput} from "@fullcalendar/core/types/input-types";
import {Availability} from "modules/Api/Model/Availability/Availability.Model";
import {Formation} from "modules/Api/Model/Formation";
import {Session} from "modules/Api/Model/Session/Session.Model";
import {Trainee} from "modules/Api/Model/Trainee/Trainee.Model";
import {combineLatest, Observable, of} from "rxjs";
import {auditTime, map} from "rxjs/operators";
import moment from "shared/moment";
import {ObjectUtils} from "shared/utils/object.utils";
import {MODULES_CONSTANTS} from "../modules.constants";
import {TIME_FULL_CALENDAR} from "./Constants";
import {EventMapper, EventMapperOptions} from "./EventMapper";
import {EventInterface} from "./Interface/Event.Interface";

interface FormationServiceInterface {
  startTime: moment.Moment;
  endTime: moment.Moment;
  hourMin: moment.Moment;
  hourMax: moment.Moment;
}

export interface CalendarFactoryOptions {
  startTime?: moment.Moment;
  endTime?: moment.Moment;
  sessions$?: Observable<EventInterface[]>;
  vacations$?: Observable<Availability[]>;
  availableSessions$?: Observable<Session[]>;
}

export class CalendarFactory {
  public static formatSession(info, content: (session: Session) => string) {
    const session: Session = EventMapper.eventToObject(info.event) as Session;
    const $el: HTMLElement = info.el.querySelector(".fc-content");
    if ($el !== undefined && session !== undefined && session.training !== undefined) {
      const $div = document.createElement("div");
      $div.innerHTML = "<i>" + content(session) + "</i>";
      $el.append($div);
    }
  }

  /**
   * Transform Api.observables$ (sessions$, vacations$, availableSessions$)
   * to readyToUseInCalendarObservables$
   */
  public static makeSessionsCalendarSource$(options: CalendarFactoryOptions): Observable<any[]> {
    const startTime = (options.startTime) ? options.startTime : null;
    const endTime = (options.endTime) ? options.endTime : null;
    const obs$ = [];

    if (options.sessions$) {
      const sessionsOptions = new EventMapperOptions();
      sessionsOptions.startTime = startTime;
      sessionsOptions.endTime = endTime;
      const sessions$ = EventMapper.getEvents$AsCalendarEvents$(options.sessions$, sessionsOptions);
      obs$.push(sessions$);
    }

    if (options.vacations$) {
      const vacationsOptions = new EventMapperOptions();
      vacationsOptions.startTime = startTime;
      vacationsOptions.endTime = endTime;
      vacationsOptions.background = true;
      vacationsOptions.open = false;
      const vacations$ = EventMapper.getEvents$AsCalendarEvents$(options.vacations$, vacationsOptions);
      obs$.push(vacations$);
    }

    if (options.availableSessions$) {
      const availableSessionsOptions = new EventMapperOptions();
      availableSessionsOptions.startTime = startTime;
      availableSessionsOptions.endTime = endTime;
      availableSessionsOptions.background = true;
      availableSessionsOptions.open = true;
      const availableSessions$ = EventMapper.getEvents$AsCalendarEvents$(options.availableSessions$, availableSessionsOptions);
      obs$.push(availableSessions$);
    }

    if (obs$.length === 0) {
      return of([]);
    }

    return combineLatest(obs$).pipe(
      auditTime(10),
      map((allEventsArray: any[][]) => allEventsArray.flat()),
    );
  }

  public static getRangeByFormation(formation: Formation): OptionsInput {
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

  public static getCalendarRangeForSpeaker(formationService: FormationServiceInterface): OptionsInput {
    let validRangeStartTime = (formationService.startTime !== null) ? formationService.startTime.clone() : null;
    let validRangeEndTime = (formationService.endTime !== null) ? formationService.endTime.clone() : null;
    const todayTime = moment();
    let defaultStartTime = todayTime.clone();

    if (validRangeStartTime !== null) {
      if (validRangeStartTime.isAfter(todayTime)) {
        defaultStartTime = validRangeStartTime.clone();
      }
    } else {
      validRangeStartTime = defaultStartTime.clone();
    }
    if (validRangeEndTime === null) {
      validRangeEndTime = validRangeStartTime.clone().add(1, "week");
    }
    return {
      defaultDate: defaultStartTime.toDate(),
      minTime: formationService.hourMin.format(TIME_FULL_CALENDAR),
      maxTime: formationService.hourMax.format(TIME_FULL_CALENDAR),
      validRange: {
        start: validRangeStartTime.toDate(),
        end: validRangeEndTime.toDate(),
      },
    };
  }

  public static getCalendarRangeForTrainee(trainee: Trainee) {
    let validRangeStartTime = (trainee.formation.startTime !== null) ? trainee.formation.startTime.clone() : null;
    const formationsEndTime = (trainee.formation.endTime !== null) ? trainee.formation.endTime.clone() : null;
    const todayTime = moment();
    let defaultStartTime = todayTime.clone();

    if (validRangeStartTime !== null) {
      if (validRangeStartTime.isAfter(todayTime)) {
        defaultStartTime = validRangeStartTime.clone();
      }
    } else {
      validRangeStartTime = defaultStartTime.clone();
    }
    let validRangeEndTime = defaultStartTime.clone().startOf("week").add(4, "week");
    if (formationsEndTime !== null && validRangeEndTime.isAfter(formationsEndTime)) {
      validRangeEndTime = formationsEndTime.clone();
    }
    return {
      defaultDate: defaultStartTime.toDate(),
      minTime: trainee.formation.hourMin.format(TIME_FULL_CALENDAR),
      maxTime: trainee.formation.hourMax.format(TIME_FULL_CALENDAR),
      validRange: {
        start: validRangeStartTime.toDate(),
        end: validRangeEndTime.toDate(),
      },
    };
  }
}
