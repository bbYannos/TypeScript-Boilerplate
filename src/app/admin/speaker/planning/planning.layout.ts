import {CardPlugin} from "bootstrap-vue";
import {CalendarWrapper} from "components/calendar/calendar-wrapper";
import {from} from "rxjs";
import {Component, Vue} from "shared/vue";
import WithRender from "./planning.layout.html";

Vue.use(CardPlugin);

@WithRender
@Component({components: {CalendarWrapper}})
export class PlanningLayout extends Vue {
  public planning$ = () => from(import(/* webpackChunkName: "admin" */ "./speaker-calendar"));
}
