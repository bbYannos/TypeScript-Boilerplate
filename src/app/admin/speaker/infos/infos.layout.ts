import {CardPlugin} from "bootstrap-vue";
import {CalendarWrapper} from "components/wrappers/calendar-wrapper";
import {from} from "rxjs";
import Vue from "vue";
import Component from "vue-class-component";
import WithRender from "./infos.layout.html";

Vue.use(CardPlugin);

@WithRender
@Component({components: {CalendarWrapper}})
export class InfosLayout extends Vue {
  public weekCalendar$ = () => from(import(/* webpackChunkName: "admin" */ "./week-calendar"));
}
