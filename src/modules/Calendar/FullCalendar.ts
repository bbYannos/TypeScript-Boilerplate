import {Calendar, OptionsInput} from "@fullcalendar/core";
import fullCalendarFr from "@fullcalendar/core/locales/fr";
import dayGridPlugin from "@fullcalendar/daygrid";
import interaction from "@fullcalendar/interaction";
import momentPlugin from "@fullcalendar/moment";
import timeGridPlugin from "@fullcalendar/timegrid";
import {BehaviorSubject, Observable, of, Subject, Subscription} from "rxjs";
import {auditTime, filter, switchMap, takeUntil, tap} from "rxjs/operators";
import {TIME_FORMAT} from "./Constants";
import {EventInterface} from "./Interface/Event.Interface";


export class FullCalendar<T extends EventInterface> {
  public close$: Observable<void> = null;
  public $htmEl: HTMLElement;
  public overrideOptions: OptionsInput = {};

  public calendar: Calendar = null;

  protected dataSource$ = of([]);
  protected rendered: boolean = false;

  protected calendarCallback_: Subject<any> = new Subject();
  protected calendarCallback$ub: Subscription = null;
  protected calendarReady_: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  protected lastInfo: any = null;

  protected options: OptionsInput = {
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
      this.options.defaultDate = args.view.activeStart;
    },
    eventClick: () => {
      return;
    },
    lazyFetching: false,
    events: (info, successCallback, failureCallback) => {
      successCallback([]);
      if (JSON.stringify(this.lastInfo) === JSON.stringify(info)) {
        return;
      }
      this.lastInfo = info;
      this.calendarCallback_.next(info);
    },
  };

  public render(options: OptionsInput = {}) {
    if (this.calendar === null) {
      this.listenCalendar();
      this.overrideOptions = options;
      this.initCalendar();
    }
  }

  public getAllEvents$(...params): Observable<any[]> {
    return this.dataSource$;
  }

  public mutateOptions(options: OptionsInput) {
    this.calendarReady_.pipe(filter((ready) => ready)).subscribe(() => {
      // @warning: mutateOptions may call calendar re-fetch events
      // actualy blocked with (JSON.stringify(this.lastInfo) === JSON.stringify(info))
      this.calendar.mutateOptions(options, []);
    });
  }

  protected initCalendar() {
    const options = {...this.options, ...this.overrideOptions};
    this.calendar = new Calendar(this.$htmEl, options);
    this.calendarReady_.next(true);
  }

  protected listenCalendar() {
    if (this.calendarCallback$ub !== null) {
      this.calendarCallback$ub.unsubscribe();
      this.calendarCallback$ub = null;
    }
    this.calendarCallback$ub = this.calendarCallback_.pipe(
      takeUntil(this.close$),
      switchMap((info) => this.getAllEvents$(info).pipe(
        auditTime(50),
        tap((results) => {
          this.calendar.removeAllEvents();
          this.calendar.addEventSource(results);
          if (!this.rendered) {
            this.calendar.render();
            this.rendered = true;
          }
        }),
      )),
    ).subscribe();
  }
}


