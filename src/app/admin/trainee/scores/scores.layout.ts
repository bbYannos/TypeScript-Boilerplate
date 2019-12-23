import {CardPlugin, TabsPlugin} from "bootstrap-vue";
import {from} from "rxjs";
import Vue from "vue";
import Component from "vue-class-component";
import WithRender from "./scores.layout.html";

Vue.use(TabsPlugin);
Vue.use(CardPlugin);

@WithRender
@Component
export class ScoresLayout extends Vue {
  public scoreList$ = () =>  from(import(/* webpackChunkName: "admin" */ "./score.list"));
}
