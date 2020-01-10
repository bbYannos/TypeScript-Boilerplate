import {EventApi, View} from "@fullcalendar/core";
import {OptionsInput} from "@fullcalendar/core/types/input-types";
import Api from "modules/Api/Api.module";
import {Formation} from "modules/Api/Model/Formation";
import {Session, SessionQuery} from "modules/Api/Model/Session/Session.Service";
import {Speaker} from "modules/Api/Model/Speaker";
import {CalendarFactoryOptions} from "modules/Calendar/Calendar.Factory";
import {TIME_FULL_CALENDAR} from "modules/Calendar/Constants";
import {CalendarFactory, EditableFullCalendar} from "modules/Calendar/module";
import {Observable} from "rxjs";
import {map, share, shareReplay, switchMap, take, tap} from "rxjs/operators";
import moment from "shared/moment";
import {ObjectUtils} from "shared/utils/object.utils";
import {Store} from "../../_store";


export class PlanningCalendar {
  public close$: Observable<any> = null;
  public $htmEl: HTMLElement = null;
  public speaker$: Observable<Speaker> = null;

  public render() {
    const planningComponent = new EditableFullCalendar(this.close$);
    planningComponent.$htmEl = this.$htmEl;
    planningComponent.service = Api.sessionService;
    planningComponent.query = new SessionQuery();

    let firstRender: boolean = true;
    Store.formation_.subscribe((formation) => {
      const calendarParams = this.getCalendarParams(formation);
      if (!firstRender) {
        delete calendarParams.defaultDate;
      } else {
        firstRender = false;
      }
      planningComponent.getAllEvents$ = (info) => {
        const options: CalendarFactoryOptions = {
          startTime: moment(info.start),
          endTime: moment(info.end),
          sessions$: formation.sessions$,
          vacations$: formation.allVacations$,
          availableSessions$: this.speaker$.pipe(
            tap((speaker) => (speaker) ? console.log(speaker.label) : console.log(speaker)),
            switchMap((speaker: Speaker) => formation.availableSessions$(moment(info.start), moment(info.end), speaker)),
          ),
        };
        return CalendarFactory.makeSessionsCalendarSource$(options);
      };
      planningComponent.render(calendarParams);
    });
  }

  protected getCalendarParams(formation: Formation = null): OptionsInput {
    let validRangeStartTime = null;
    let validRangeEndTime = null;
    if (formation !== null) {
      validRangeStartTime = (ObjectUtils.isValidMoment(formation.startTime)) ? formation.startTime : null;
      validRangeEndTime = (ObjectUtils.isValidMoment(formation.endTime)) ? formation.endTime : null;
    }
    const todayTime = moment();
    let defaultStartTime = todayTime.clone();
    if (validRangeStartTime !== null) {
      if (validRangeStartTime.isAfter(defaultStartTime)) {
        defaultStartTime = validRangeStartTime;
      }
    } else {
      validRangeStartTime = defaultStartTime.clone();
    }
    if (validRangeEndTime === null) {
      validRangeEndTime = validRangeStartTime.clone().add(1, "week");
    }

    return {
      defaultView: "timeGridWeek",
      defaultDate: defaultStartTime.toDate(),
      minTime: (formation) ? formation.hourMin.format(TIME_FULL_CALENDAR) : Api.formationService.hourMin.format(TIME_FULL_CALENDAR),
      maxTime: (formation) ? formation.hourMax.format(TIME_FULL_CALENDAR) : Api.formationService.hourMax.format(TIME_FULL_CALENDAR),
      header: {left: "prev,next", center: "title", right: ""},

      validRange: {
        start: validRangeStartTime.toDate(),
        end: validRangeEndTime.toDate(),
      },

      select: () => {
        return;
      },
      eventReceive: (info) => {
        this.addExternalEvent(info);
        info.event.remove();
      },
    };
  }

  protected addExternalEvent(info: { event: EventApi; draggedEl: HTMLElement; view: View; }) {
    console.log("Add external");
    const training = Api.trainingService.getByIdentifier(info.draggedEl.dataset.training);
    const droppedStartTime = moment(info.event.start);
    const droppedEndTime = droppedStartTime.clone().add(1, "second");

    Store.formation_.getValue().availableSessions$().pipe(take(1)).subscribe((sessions: Session[]) => {
      console.log("Available Sessions", sessions);
      const availableSession = sessions.find(
        (session: Session) => session.startTime.isBefore(droppedEndTime) && session.endTime.isAfter(droppedStartTime)
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

export default PlanningCalendar;
