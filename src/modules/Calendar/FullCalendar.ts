import {Calendar, OptionsInput} from "@fullcalendar/core";
import fullCalendarFr from "@fullcalendar/core/locales/fr";
import dayGridPlugin from "@fullcalendar/daygrid";
import interaction from "@fullcalendar/interaction";
import momentPlugin from "@fullcalendar/moment";
import timeGridPlugin from "@fullcalendar/timegrid";
import {Observable, of, Subject, Subscription} from "rxjs";
import {auditTime, map, shareReplay, switchMap, take, takeUntil, tap} from "rxjs/operators";
import {Component} from "shared/nunjucks";
import {ObjectUtils} from "shared/utils/object.utils";
import {TIME_FORMAT} from "./Constants";
import {EventInterface} from "./Interface/Event.Interface";
import {EventSourceInterface} from "./Interface/EventSource.Interface";

export class FullCalendar extends Component {
  public calendar: Calendar = null;
  public service: EventSourceInterface<EventInterface> = null;
  public query: any = null;

  protected source$ = of([]);
  protected calendarCallback_: Subject<{ info: any, cb: (...params) => void }> = new Subject();
  protected calendarCallback$: Observable<{ info: any, cb: (...params) => void }> = this.calendarCallback_.asObservable().pipe(
    takeUntil(this.close_),
    shareReplay(1),
  );
  protected calendarCallback$ub: Subscription = null;
  protected constructorName = "FullCalendar";
  protected calendarParams: OptionsInput = {
    plugins: [interaction, timeGridPlugin, momentPlugin, dayGridPlugin],
    header: {left: "prev,today,next", center: "title", right: "month,basicWeek,basicDay"},
    showNonCurrentDates: false,
    fixedWeekCount: false,
    height: "auto",
    // slotDuration: moment.duration(30, 'minute').format(TIME_FULL_CALENDAR, { trim: false }),
    // slotLabelInterval:  moment.duration(1, 'hour').format(TIME_FULL_CALENDAR, { trim: false }),
    locales: [fullCalendarFr],
    locale: fullCalendarFr,
    allDaySlot: false,
    hiddenDays: [0, 6],
    slotLabelFormat: TIME_FORMAT,
    datesRender: (args) => {
      this.calendarParams.defaultDate = args.view.activeStart;
    },
    // eventAfterRender: FullCalendarMapper.eventAfterRender,
    eventClick: () => {
      // console.log('eventClick', args);
    },
    lazyFetching: false,
    events: (info, successCallback, failureCallback) => this.getEventsCalledByCalendar(info, successCallback, failureCallback),
  };


  public get toolBar() {
    return this.find(".fc-toolbar.fc-header-toolbar");
    /**
     * todo:
     *  const $toolbarWrapper =
     *  this.$wrapper.parent().find(FullCalendarComponent.jqSelectorToolbar)
     *  .addClass('dataTables_wrapper fc fc-unthemed fc-ltr');
     *   toolBar.appendTo($toolbarWrapper);
     */
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

  public static eventToObject(event): EventInterface {
    return event.extendedProps.apiObject;
  }

  public setSource$(sources$: Observable<any[]>) {
    this.source$ = sources$.pipe(
      map((objects) => objects.map((object) =>
        FullCalendar.objectToEvent(object)).filter((event) => event !== null),
      ));
  }

  public render(calendarParams: OptionsInput = {}) {
    if (this.calendar !== null) {
      this.calendar.destroy();
    }
    this.calendarParams = {...this.calendarParams, ...calendarParams};
    this.listenToCalendar();
    this.calendar = new Calendar(this.$htmEl, this.calendarParams);
    this.calendar.render();
  }

  public getEventsCalledByCalendar(info, successCallback, failureCallback) {
    // console.log('CALENDAR WANTS TO GET EVENTS');
    this.calendarCallback_.next({info: info, cb: successCallback});
  }

  protected listenToCalendar() {
    if (this.calendarCallback$ub !== null) {
      this.calendarCallback$ub.unsubscribe();
      this.calendarCallback$ub = null;
    }

    // this.getAllEvents$(info) creates a new Obs$
    // if mergeMap -- multiple subscribe -> multiple calls : keep subscription to this.getAllEvents$ at each call
    // if switchMap -- one subscribe -> one call : unsubscribe to previous and create a new one
    // @link: https://guide-angular.wishtack.io/angular/observables/operateurs/mergemap-and-switchmap
    this.calendarCallback$ub = this.calendarCallback$.pipe(
      switchMap(({info, cb}) => {
        return this.getAllEvents$(info).pipe(
          auditTime(50),
          // first one for Cb / Second one to launch re fetch Events
          // Could be Optimise by keeping results fro next re fetch
          take(2),
          tap((results) => {
            if (cb !== null) {
              // console.log('callBack Calendar', results);
              cb(results);
              cb = null;
            } else {
              // console.log('getAllEvents$ reFetch Events');
              this.calendar.refetchEvents();
            }
          }),
        );
      }),
    ).subscribe();
  }

  public getAllEvents$(info): Observable<any[]> {
    return this.source$;
  }
}


