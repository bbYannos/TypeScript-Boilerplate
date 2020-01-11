import {CardPlugin, TabsPlugin} from "bootstrap-vue";
import {ListWrapper} from "components/lists/list-wrapper";
import {CalendarWrapper} from "components/wrappers/calendar-wrapper";
import {from} from "rxjs";
import Vue from "vue";
import Component from "vue-class-component";
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
