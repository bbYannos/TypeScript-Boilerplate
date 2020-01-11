import {EventApi, View} from "@fullcalendar/core";
import {OptionsInput} from "@fullcalendar/core/types/input-types";
import {Observable} from "rxjs";
import moment from "shared/moment";
import {IconsUtils} from "shared/utils/icons.utils";
import {EventMapper} from "./EventMapper";
import {FullCalendar} from "./FullCalendar";
import {EventInterface} from "./Interface/Event.Interface";

export class EditableFullCalendar<T extends EventInterface> extends FullCalendar<T> {

  public deleteAction: (object: T) => Observable<boolean> = null;
  public updateAction: (object: T) => Observable<T> = null;
  public editAction: (object: T) => void = null;
  public createAction: (startTime: moment.Moment, endTime: moment.Moment) => Observable<T> = null;
  public addExternalEvent: (info: { event: EventApi; draggedEl: HTMLElement; view: View; }) => void = null;

  // noinspection ES6ClassMemberInitializationOrder
  protected options: OptionsInput = {...this.options, ...{
      defaultView: "timeGridWeek",
      selectable: true,
      editable: true,
      columnHeaderText: (date) => moment(date).format("dddd"),
      select: (args) => {
        if (this.createAction !== null) {
          this.createAction(moment(args.start), moment(args.end)).subscribe();
        }
      },
      eventRender: (info) => {
        this.addDeleteIcon(info);
        this.eventAfterRender(info);
      },
      eventResize: (data: any) => {
        if (this.updateAction !== null) {
          const object = EventMapper.eventToObject<T>(data.event);
          if (data.startDelta.milliseconds) {
            object.moveStartTime(data.startDelta.milliseconds);
          }
          if (data.endDelta.milliseconds) {
            object.moveEndTime(data.endDelta.milliseconds);
          }
          this.updateAction(object).subscribe();
        }
      },
      eventDrop: (data: any) => {
        if (this.updateAction !== null) {
          const object = EventMapper.eventToObject<T>(data.event);
          object.startTime = moment(data.event.start);
          this.updateAction(object).subscribe();
        }
      },
      eventReceive: (info) => {
        if (this.addExternalEvent !== null) {
          this.addExternalEvent(info);
        }
      },
    }};

  protected initCalendar() {
    this.options.selectable = (this.createAction !== null);
    this.options.editable = (this.updateAction !== null);
    super.initCalendar();
  }

  protected addDeleteIcon(data: any) {
    if (this.deleteAction !== null && data.event._def.rendering !== "background") {
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
  }

  protected eventAfterRender(data) {
    return;
  }
}

