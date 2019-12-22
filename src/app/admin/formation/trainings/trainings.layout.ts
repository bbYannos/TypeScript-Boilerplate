import {CardPlugin, TabsPlugin} from "bootstrap-vue";
import {from} from "rxjs";
import Vue from "vue";
import Component from "vue-class-component";
import WithRender from "./trainings.layout.html";

Vue.use(TabsPlugin);
Vue.use(CardPlugin);

@WithRender
@Component
export class TrainingsLayout extends Vue {
  public trainingList$ = () =>  from(import(/* webpackChunkName: "admin" */ "./training.list"));
  public moduleList$ = () =>  from(import(/* webpackChunkName: "admin" */ "../module.list"));
}
