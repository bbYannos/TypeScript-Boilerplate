import {EventApi, View} from "@fullcalendar/core";
import Api from "modules/Api/Api.module";
import {Formation} from "modules/Api/Model/Formation";
import {Session, SessionQuery} from "modules/Api/Model/Session/Session.Service";
import {Speaker} from "modules/Api/Model/Speaker";
import {CalendarFactoryOptions} from "modules/Calendar/Calendar.Factory";
import {DATE_FULL_CALENDAR, TIME_FULL_CALENDAR} from "modules/Calendar/Constants";
import {EditableFullCalendar} from "modules/Calendar/FullCalendarEditable";
import {CalendarFactory, OptionsInput} from "modules/Calendar/module";
import {Observable, Subject} from "rxjs";
import {take} from "rxjs/operators";
import moment from "shared/moment";
import {ObjectUtils} from "shared/utils/object.utils";

export class DisplayedObjects<T> {
  public startTime: moment.Moment;
  public endTime: moment.Moment;
  public objects: T[];

  public isSame(displayedObjects: DisplayedObjects<T>): boolean {
    return (
      this.startTime.isSame(displayedObjects.startTime) &&
      this.endTime.isSame(displayedObjects.endTime)
    );
  }
}

// tslint:disable-next-line
export class SessionFullCalendar extends EditableFullCalendar<Session> {
  public service = Api.sessionService;
  public query = new SessionQuery();

  protected displayedSessions_: Subject<DisplayedObjects<Session>> = new Subject<DisplayedObjects<Session>>();
  public displayedSessions$: Observable<DisplayedObjects<Session>> = this.displayedSessions_.asObservable();

  protected _formation: Formation = null;

  public get formation(): Formation {
    return this._formation;
  }

  public set formation(formation: Formation) {
    this._formation = formation;
    this.query.formation = this._formation;
  }

  protected _speaker: Speaker = null;

  public get speaker() {
    return this._speaker;
  }

  public set speaker(speaker: Speaker) {
    if (speaker !== this._speaker) {
      this._speaker = speaker;
      this.calendar.refetchEvents();
    }
  }

  protected get overrideCalendarParams(): OptionsInput {
    const formationStart = (ObjectUtils.isValidMoment(this._formation.startTime)) ? this._formation.startTime.format(DATE_FULL_CALENDAR) : null;
    const formationEnd = (ObjectUtils.isValidMoment(this._formation.endTime)) ? this._formation.endTime.format(DATE_FULL_CALENDAR) : null;
    const start = formationStart;
    /*
    if (routerService.cache.sessionFullCalendar !== undefined && routerService.cache.sessionFullCalendar.start !== undefined) {
      start = routerService.cache.sessionFullCalendar.start;
    } else if (moment().isAfter(moment(start))) {
      start = moment().format(DATE_FULL_CALENDAR);
    }
    */
    return {
      defaultView: "timeGridWeek",
      defaultDate: start,
      minTime: this._formation.hourMin.format(TIME_FULL_CALENDAR),
      maxTime: this._formation.hourMax.format(TIME_FULL_CALENDAR),
      header: {left: "prev,next", center: "title", right: "dayGridMonth,timeGridWeek"},

      validRange: {
        start: formationStart,
        end: formationEnd,
      },

      select: () => {
        return;
      },
      eventReceive: (info) => {
        this.addExternalEvent(info);
        this.speaker = null;
        info.event.remove();
      },
      eventRender: (info) => this.eventAfterRender(info),
    };
  }

  public render() {
    super.render(this.overrideCalendarParams);
  }

  public getAllEvents$(info): Observable<any[]> {
    const startTime = moment(info.start);
    const endTime = moment(info.end);

    const options: CalendarFactoryOptions = {
      startTime: moment(info.start),
      endTime: moment(info.end),
      sessions$: this._formation.sessions$,
      vacations$: this._formation.allVacations$,
      availableSessions$: this._formation.availableSessions$(startTime, endTime, this._speaker),
    };

    return CalendarFactory.makeSessionsCalendarSource$(options);
  }

  public eventAfterRender(info) {
    super.eventAfterRender(info);
    CalendarFactory.formatSession(info, (session: Session) => session.training.speaker.shortName);
  }

  public getEventsCalledByCalendar(info, successCallback, failureCallback) {
    /*
    routerService.cache.sessionFullCalendar = {
      start: info.start,
      end: info.end,
    }; */
    super.getEventsCalledByCalendar(info, successCallback, failureCallback);
  }

  protected addExternalEvent(info: { event: EventApi; draggedEl: HTMLElement; view: View; }) {
    this._speaker = null;
    const training = Api.trainingService.getByIdentifier(info.draggedEl.dataset.training);
    const droppedStartTime = moment(info.event.start);
    const droppedEndTime = droppedStartTime.clone().add(1, "second");

    this._formation.availableSessions$().pipe(take(1)).subscribe((sessions: Session[]) => {
      const availableSession = sessions.find(
        (session: Session) => session.startTime.isBefore(droppedEndTime) && session.endTime.isAfter(droppedStartTime),
      );
      if (training && availableSession) {
        const query = Object.assign(new SessionQuery(), {
          training: training,
          startTime: availableSession.startTime,
          endTime: availableSession.endTime,
        });
        Api.sessionService.createByQuery(query).subscribe();
      }
    });
  }
}
