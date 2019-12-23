import {CardPlugin} from "bootstrap-vue";
import {CalendarWrapper} from "components/wrappers/calendar-wrapper";
import {from} from "rxjs";
import Vue from "vue";
import Component from "vue-class-component";
import WithRender from "./planning.layout.html";

Vue.use(CardPlugin);

@WithRender
@Component({components: {CalendarWrapper}})
export class PlanningLayout extends Vue {
  public planning$ = () => from(import(/* webpackChunkName: "admin" */ "./speaker-calendar"));
}
