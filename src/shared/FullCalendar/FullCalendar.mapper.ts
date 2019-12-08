import moment from "shared/moment";
import {EventInterface, OperationInterface, SpeakerInterface} from "../Event.Interface";

export class FullCalendarEvent {
    public title: string = "";
    public type: string = "";
    public description: string = "";
    public start: moment.Moment;
    public end: moment.Moment;
    public apiEvent: EventInterface;
    public color: string;
}


export class FullCalendarMapper {
    public static currentSpeaker: SpeakerInterface = null;

    public static calendarEventToEventInterface(calendarEvent: FullCalendarEvent): EventInterface {
        return calendarEvent.apiEvent;
    }

    public static eventInterfacesToCalendarEvents(events: EventInterface[]): FullCalendarEvent[] {
        const fullCalendarEvents = [];
        events.forEach((event) => {
            const _calendarEvents = this.eventInterfaceToCalendarEvents(event);
            _calendarEvents.forEach((_calendarEvent) => {
                fullCalendarEvents.push(_calendarEvent);
            });
        });
        return fullCalendarEvents;
    }

    public static eventInterfaceToCalendarEvents(event: EventInterface): FullCalendarEvent[] {
        const fullCalendarEvents: FullCalendarEvent[] = [];
        if (this.currentSpeaker !== null) {
            event.operations.forEach((operation: OperationInterface) => {
                if (operation.speaker.uid === this.currentSpeaker.uid) {
                    fullCalendarEvents.push(this.eventInterfaceToCalendarEvent(event, operation));
                }
            });
        } else {
            fullCalendarEvents.push(this.eventInterfaceToCalendarEvent(event));
        }
        return fullCalendarEvents;
    }

    public static eventInterfaceToCalendarEvent(event: EventInterface, operation: OperationInterface = null): FullCalendarEvent {
        const fullCalendarEvent = new FullCalendarEvent();
        fullCalendarEvent.title = event.title;
        fullCalendarEvent.start = event.startTime;
        fullCalendarEvent.end = event.endTime;
        if (operation !== null) {
            fullCalendarEvent.start = operation.startTime;
            fullCalendarEvent.end = operation.endTime;
        }
        fullCalendarEvent.apiEvent = event;
        fullCalendarEvent.color = event.color;
        return fullCalendarEvent;
    }

    public static eventRender(event: FullCalendarEvent, $el) {
        $el.popover({
            title: event.title,
            content: FullCalendarMapper.getPopupContent(event.apiEvent),
            html: true,
            trigger: "hover",
            placement: "top",
            container: "body",
        });
    }

    public static getPopupContent(event: EventInterface) {
        const popupContent = require("./FullCalendar.PopUp.njk");
        return popupContent.render({ event: event, moment: moment});
    }

    public static eventAfterRender(event, element, view) {
        if (event.end !== null) {
            if (event.end.isBefore(view.end) && event.end.format("H") < 14) {
                const $el = $(element);
                const $elWidth = Number($el.css("width").replace("px", "")) ;
                let colSpan = 1;
                const $parentColSpan = $el.parent().attr("colspan");
                if ($parentColSpan) {
                    colSpan = Number($parentColSpan);
                }
                const halfDayWidth = $elWidth / colSpan / 2;
                $el.css("margin-right", halfDayWidth + "px");
            }
        }
    }
}
