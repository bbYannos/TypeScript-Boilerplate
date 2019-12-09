import {calendarModule$} from "modules/Calendar";
import {of} from "rxjs";
import {ComponentNjk} from "shared/nunjucks";

export class CalendarComponent extends ComponentNjk {
  protected njk = require("./calendar.component.njk");
  public data = {
    title: "Planning",
    selector: "calendar",
  };

  public render() {
    super.render();
    calendarModule$.subscribe(({FullCalendar}) => {
      const planningComponent = new FullCalendar();
      planningComponent.$htmEl = this.find(this.data.selector);
      planningComponent.getAllEvents$ = () => of([]);
      planningComponent.render();
    });

  }
}
