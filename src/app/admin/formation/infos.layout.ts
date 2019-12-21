import {CardPlugin, TabsPlugin} from "bootstrap-vue";
import {from} from "rxjs";
import Vue from "vue";
import Component from "vue-class-component";
import WithRender from "./infos.layout.html";

Vue.use(TabsPlugin);
Vue.use(CardPlugin);

@WithRender
@Component
export class InfosLayout extends Vue {
  public vacationList$ = () =>  from(import(/* webpackChunkName: "admin" */ "./vacation.list"));
}
