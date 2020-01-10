import {OptionsInput} from "@fullcalendar/core/types/input-types";
import {Observable} from "rxjs";
import moment from "shared/moment";
import {IconsUtils} from "shared/utils/icons.utils";
import {EventMapper} from "./EventMapper";
import {FullCalendar} from "./FullCalendar";
import {EventInterface} from "./Interface/Event.Interface";

export class EditableFullCalendar<T extends EventInterface> extends FullCalendar<T> {
  public editAction: (object: T) => void = null;
  protected constructorName = "EditableFullCalendar";

  public render(calendarParams: OptionsInput = {}) {
    super.render({...this.getCalendarParams(), ...calendarParams});
  }

  public createAction(startTime: moment.Moment, endTime: moment.Moment): Observable<T> {
    if (this.service !== null && this.query !== null) {
      this.query.startTime = startTime;
      this.query.endTime = endTime;
      return this.service.createByQuery(this.query);
    }
    return null;
  }

  public deleteAction(object: T): Observable<boolean> {
    return (this.service !== null) ? this.service.delete(object) : null;
  }

  public updateAction(object: T): Observable<T> {
    return (this.service !== null) ? this.service.update(object) : null;
  }

  protected getCalendarParams(): OptionsInput {
    // tslint:disable-next-line
    return {
      defaultView: "timeGridWeek",
      header: {left: "", center: "", right: ""},
      selectable: true,
      editable: true,
      columnHeaderText: (date) => moment(date).format("dddd"),
      select: (args) => {
        this.createAction(moment(args.start), moment(args.end)).subscribe();
      },
      eventRender: (info) => this.eventAfterRender(info),
      eventResize: (data: any) => {
        const object = EventMapper.eventToObject<T>(data.event);
        if (data.startDelta.milliseconds) {
          object.moveStartTime(data.startDelta.milliseconds);
        }
        if (data.endDelta.milliseconds) {
          object.moveEndTime(data.endDelta.milliseconds);
        }
        this.updateAction(object).subscribe();
      },
      eventDrop: (data: any) => {
        console.log("Event Dropped");
        const object = EventMapper.eventToObject<T>(data.event);
        object.startTime = moment(data.event.start);
        this.updateAction(object).subscribe();
      },
    };
  }

  protected addDeleteIcon(data: any) {
    const html: HTMLElement = data.el;
    const object = EventMapper.eventToObject<T>(data.event);
    const $body = html.querySelector(".fc-content");
    const $deleteLink = document.createElement("div");
    $deleteLink.classList.add("fc-delete");
    $deleteLink.innerHTML = IconsUtils.deleteIcon();
    $body.prepend($deleteLink);
    $deleteLink.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      data.event.remove();
      this.deleteAction(object).subscribe();
    });
  }

  protected eventAfterRender(data) {
    if (data.event._def.rendering !== "background") {
      this.addDeleteIcon(data);
    }
  }
}

