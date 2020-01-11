import {OptionsInput} from "@fullcalendar/core/types/input-types";
import {EditableFullCalendar} from "modules/Calendar/FullCalendarEditable";
import {BehaviorSubject, Observable, of} from "rxjs";
import {AbstractApiModel, AbstractPeriod} from "shared/abstract-api/classes/models";
import {AbstractRepositoryService} from "shared/abstract-api/classes/services";
import moment from "shared/moment";

interface EventQueryInterface {
  startTime: moment.Moment;
  endTime: moment.Moment;
}

interface QueryService<T extends AbstractApiModel> extends AbstractRepositoryService<T> {
  createByQuery(query: EventQueryInterface): Observable<T>;
}

export class CalendarComponent<T extends AbstractPeriod> {

  public loading_: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  protected overrideOptions: OptionsInput = {};
  protected service: QueryService<T> = null;
  protected query: EventQueryInterface = null;
  protected _component: EditableFullCalendar<any> = null;

  constructor(public $htmEl: HTMLElement, public close$: Observable<any>) {}

  public render() {
    this.component.render(this.overrideOptions);
  }

  protected get component() {
    if (this._component === null) {
      this._component = new EditableFullCalendar();
      this._component.overrideOptions = this.overrideOptions;
      this._component.close$ = this.close$;
      this._component.$htmEl = this.$htmEl;
      this._component.editAction = this.editAction;
      this._component.updateAction = this.updateAction;
      this._component.deleteAction = this.deleteAction;
      this._component.createAction = this.createAction;
    }
    return this._component;
  }

  public createAction: (startTime: moment.Moment, endTime: moment.Moment) => Observable<T> = (startTime, endTime) => {
    if (this.service !== null && this.query !== null) {
      this.query.startTime = startTime;
      this.query.endTime = endTime;
      return this.service.createByQuery(this.query);
    }
    return of(null);
  };

  public deleteAction: (object: T) => Observable<boolean> = (object: T) => {
    if (this.service !== null) {
      return this.service.delete(object);
    }
    return of(false);
  };

  public updateAction: (object: T) => Observable<T> = (object: T) => {
    if (this.service !== null) {
      return this.service.update(object);
    }
    return of(object);
  };

  public editAction: (object: T) => void = (object: T) => {
    return;
  };
}
