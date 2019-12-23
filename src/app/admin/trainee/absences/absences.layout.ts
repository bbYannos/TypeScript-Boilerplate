import {CardPlugin, TabsPlugin} from "bootstrap-vue";
import {from} from "rxjs";
import Vue from "vue";
import Component from "vue-class-component";
import WithRender from "./absences.layout.html";

Vue.use(TabsPlugin);
Vue.use(CardPlugin);

@WithRender
@Component
export class AbsencesLayout extends Vue {
  public absenceList$ = () =>  from(import(/* webpackChunkName: "admin" */ "./absence.list"));
  public delayList$ = () =>  from(import(/* webpackChunkName: "admin" */ "./delay.list"));
}
