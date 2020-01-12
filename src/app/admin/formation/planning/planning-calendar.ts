import {EventApi, View} from "@fullcalendar/core";
import {CalendarComponent} from "components/calendar/calendar.component";
import Api from "modules/Api/Api.module";
import {Formation} from "modules/Api/Model/Formation";
import {Session, SessionQuery} from "modules/Api/Model/Session/Session.Service";
import {Speaker} from "modules/Api/Model/Speaker";
import {CalendarFactoryOptions} from "modules/Calendar/Calendar.Factory";
import {CalendarFactory} from "modules/Calendar/module";
import {Observable} from "rxjs";
import {switchMap, take, tap} from "rxjs/operators";
import moment from "shared/moment";
import {Store} from "../../_store";


export class PlanningCalendar extends CalendarComponent<Session> {
  public speaker$: Observable<Speaker> = null;
  protected service = Api.sessionService;
  protected editable = true;

  protected overrideOptions = {
    header: {left: "prev,next", center: "title", right: ""},
  };

  public render() {
    this.component.getAllEvents$ = (info: any) => Store.formation_.pipe(
      tap((formation: Formation) => {
        this.component.mutateOptions(CalendarFactory.getRangeByFormation(formation));
      }),
      switchMap((formation: Formation) => {
        const startTime = moment(info.start).startOf("week");
        const endTime = moment(info.start).clone().endOf("week");
        const options: CalendarFactoryOptions = {
          startTime: startTime,
          endTime: endTime,
          events$: formation.sessions$,
          vacations$: formation.allVacations$,
          availableSessions$: this.speaker$.pipe(
            tap((speaker) => (speaker) ? console.log(speaker.label) : console.log(speaker)),
            switchMap((speaker: Speaker) => formation.availableSessions$(moment(info.start), moment(info.end), speaker)),
          ),
        };
        return CalendarFactory.makeSessionsCalendarSource$(options).pipe(
          tap(() => this.loading_.next(false)),
        );
      }),
    );
    super.render();
  }

  protected addExternalEvent = (info: { event: EventApi; draggedEl: HTMLElement; view: View; }) => {
    const training = Api.trainingService.getByIdentifier(info.draggedEl.dataset.training);
    const droppedStartTime = moment(info.event.start);
    const droppedEndTime = droppedStartTime.clone().add(1, "second");
    Store.formation_.getValue().availableSessions$(droppedStartTime, droppedEndTime).pipe(take(1)).subscribe((sessions: Session[]) => {
      const availableSession = sessions.find(
        (session: Session) => session.startTime.isBefore(droppedEndTime) && session.endTime.isAfter(droppedStartTime),
      );
      if (training && availableSession) {
        const query = Object.assign(new SessionQuery(), {
          training: training,
          startTime: availableSession.startTime,
          endTime: availableSession.endTime,
        });
        Api.sessionService.createByQuery(query).subscribe(() => {
          info.event.remove();
        });
      }
    });
  };
}

export default PlanningCalendar;
