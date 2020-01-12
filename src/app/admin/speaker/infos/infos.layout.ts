import {CardPlugin} from "bootstrap-vue";
import {CalendarWrapper} from "components/calendar/calendar-wrapper";
import {from} from "rxjs";
import {Component, Vue} from "shared/vue";
import WithRender from "./infos.layout.html";

Vue.use(CardPlugin);

@WithRender
@Component({components: {CalendarWrapper}})
export class InfosLayout extends Vue {
  public weekCalendar$ = () => from(import(/* webpackChunkName: "admin" */ "./template-week-calendar"));
}
