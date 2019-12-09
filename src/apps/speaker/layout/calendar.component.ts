import {calendarModule$} from "modules/Calendar";
import {of} from "rxjs";
import {FullCalendar} from "../../../modules/Calendar/FullCalendar";

export class CalendarComponent extends ComponentNjk {
  protected njk = require("./calendar.component.njk");
  public data = {
    title: "Planning",
    selector: "calendar",
  };

  public render() {
    super.render();
    calendarModule$.subscribe(({FullCalendar_}) => {
      /* @var FullCalendar planningComponent*/
      const planningComponent: FullCalendar = new FullCalendar_();
      planningComponent.getAllEvents$ = () => of([]);
      planningComponent.render();
    });
  }
}
