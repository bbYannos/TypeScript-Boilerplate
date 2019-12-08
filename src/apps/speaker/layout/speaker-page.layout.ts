import Api from "modules/Api/login";
import {ComponentNjk} from "shared/nunjucks";

export class SpeakerLayout extends ComponentNjk {
  protected njk = require("./speaker-page.layout.html");
  protected loading = true;

  public data = {
    ...super.data,
    speaker: null,
  };

  public render() {
    super.render({})
    this.manageHeader();
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
