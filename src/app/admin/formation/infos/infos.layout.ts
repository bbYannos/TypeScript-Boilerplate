import {CardPlugin, TabsPlugin} from "bootstrap-vue";
import {CalendarWrapper} from "components/calendar/calendar-wrapper";
import {ListWrapper} from "components/lists/list-wrapper";
import {from} from "rxjs";
import {Component, Vue} from "shared/vue";
import {FormationForm} from "./formation.form";
import WithRender from "./infos.layout.html";

Vue.use(TabsPlugin);
Vue.use(CardPlugin);

@WithRender
@Component({components: {ListWrapper, CalendarWrapper, FormationForm}})
export class InfosLayout extends Vue {
  public vacationList$ = () =>  from(import(/* webpackChunkName: "admin" */ "./vacation.list"));
  public provisionalCalendar$ = () => from(import(/* webpackChunkName: "admin" */ "./provisional-calendar"));
  public weekCalendar$ = () => from(import(/* webpackChunkName: "admin" */ "./template-week-calendar"));
}
