import "assets/_user";
import {CalendarWrapper} from "components/calendar-wrapper";
import {CardComponent} from "components/card";
import {MainPageLayout} from "layouts/user-page";
import {Absence} from "modules/Api/Model/Absence";
import {forkJoin, from} from "rxjs";
import {take} from "rxjs/operators";
import Vue from "vue";
import Component from "vue-class-component";
import {routerAuthService} from "../routes/router";
import WithRender from "./page.layout.html";

@WithRender
@Component({
  components: {MainPageLayout, CardComponent, CalendarWrapper},
})
export class SpeakerPageLayout extends Vue {
  public planningCard: CardComponent["data"] = {
    label: "Planning",
    loading: false,
  };

  public absenceCard: CardComponent["data"] = {
    label: "Absences",
    loading: false,
  };

  public data: {
    absences: Absence[],
    unjustifiedAbsences: Absence[],
    delays: Absence[],
  } = {
    absences: [],
    unjustifiedAbsences: [],
    delays: [],
  };

  public calendarComponent$ = () => from(import(/* webpackChunkName: "trainee" */ "./trainee-calendar"));

  public mounted() {
    const trainee = routerAuthService.user.trainee;
    forkJoin([trainee.absences$.pipe(take(1)), trainee.delays$.pipe(take(1))]).subscribe(([absences, delays]) => {
      this.data.absences = absences;
      this.data.unjustifiedAbsences = absences.filter((absence: Absence) => !absence.justified);
      this.data.delays = delays;
    });
  }
}
export default Vue.component("speaker-page-layout", SpeakerPageLayout);



