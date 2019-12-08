import {OptionsInput} from "@fullcalendar/core/types/input-types";
import _ from "lodash";
import moment from "shared/moment";
import {IconsUtils} from "../../shared/utils/icons.utils";
import {EventMapper} from "./EventMapper";
import {FullCalendar} from "./FullCalendar";
import {EventInterface} from "./Interface/Event.Interface";

export class EditableFullCalendar extends FullCalendar {
  protected constructorName = "EditableFullCalendar";

  protected get calendarParams(): OptionsInput {
    // tslint:disable-next-line
    return Object.assign(super.calendarParams, {
      defaultView: "timeGridWeek",
      header: {left: "", center: "", right: ""},
      selectable: true,
      editable: true,
      columnHeaderText: (date) => moment(date).format("dddd"),
      // minTime:  APP_CONST.SCHEDULE.OPENING.format(TIME_FULL_CALENDAR),
      // maxTime:  APP_CONST.SCHEDULE.CLOSING.format(TIME_FULL_CALENDAR),
      select: (args) => {
        this.createEvent(moment(args.start), moment(args.end));
      },
      eventRender: (info) => this.eventAfterRender(info),
      eventResize: (data: any) => {
        const object: EventInterface = EventMapper.eventToObject(data.event);
        if (data.startDelta.milliseconds) {
          object.moveStartTime(data.startDelta.milliseconds);
        }
        if (data.endDelta.milliseconds) {
          object.moveEndTime(data.endDelta.milliseconds);
        }
        this.service.update(object).subscribe();
      },
      eventDrop: (data: any) => {
        const object: EventInterface = data.event.extendedProps.apiObject;
        object.startTime = moment(data.event.start);
        this.service.update(object).subscribe();
      },
    });
  }

  protected addDeleteIcon(data: any) {
    const html: HTMLElement = data.el;
    const object: EventInterface = FullCalendar.eventToObject(data.event);
    const $body = html.querySelector(".fc-content");
    const $deleteLink = document.createElement("div");
    $deleteLink.classList.add("fc-delete");
    $deleteLink.innerHTML = IconsUtils.deleteIcon();
    $body.prepend($deleteLink);
    $deleteLink.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      data.event.remove();
      this.service.delete(object).subscribe();
    });
  }

  protected eventAfterRender(data) {
    this.addDeleteIcon(data);
  }

  protected createEvent(startTime: moment.Moment, endTime: moment.Moment) {
    const query = _.clone(this.query);
    query.startTime = startTime;
    query.endTime = endTime;
    const response = this.service.createByQuery(query);
    response.subscribe();
  }
}

