import Api from "modules/Api/login";
import {from, of} from "rxjs";
import {map} from "rxjs/operators";

import {ComponentNjk} from "shared/nunjucks";

export class SpeakerLayout extends ComponentNjk {
  public data = {
    ...super.data,
    speaker: null,
  };
  protected njk = require("./speaker-page.layout.html");
  protected loading = true;

  public render() {
    super.render({});
    this.manageHeader();
    from(import(/* webpackChunkName: "full-calendar" */ "modules/Calendar")).pipe(
    ).subscribe((module) => {
      const planningComponent = new module.FullCalendar();
      planningComponent.$htmEl = this.find(".planning");
      planningComponent.getAllEvents$ = () => of([]);

      /*
      const calendarParams: OptionsInput =  CalendarFactory.getCalendarRangeForSpeaker();
      calendarParams.header =  {left: "prev,next", center: "title", right: ""};
      calendarParams.eventRender = (info) => CalendarFactory.formatSession(info, (session: Session) => session.training.formation.label);
       {
        const options: CalendarFactoryOptions = {
          startTime: moment(info.start),
          endTime: moment(info.end),
          sessions$: this.data.speaker.sessions$,
        };
        return CalendarFactory.makeSessionsCalendarSource$(options);
      };
       */
      planningComponent.render();
    });
    /*
    const publicPlanningLayout = new PublicPlanningLayout(this.njkParams);
    publicPlanningLayout.$htmEl = this._$htmEl.find(".PublicPlanningLayout");
    publicPlanningLayout.render();
    */
  }

  protected manageHeader() {
    const logout$ = this.find("#logout");
    logout$.addEventListener("click", (e) => {
      Api.userService.logout().subscribe();
    });
  }
}
