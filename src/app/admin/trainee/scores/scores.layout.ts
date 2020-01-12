import {CardPlugin, TabsPlugin} from "bootstrap-vue";
import {from} from "rxjs";
import {Component, Vue} from "shared/vue";
import WithRender from "./scores.layout.html";

Vue.use(TabsPlugin);
Vue.use(CardPlugin);

@WithRender
@Component
export class ScoresLayout extends Vue {
  public scoreList$ = () =>  from(import(/* webpackChunkName: "admin" */ "./score.list"));
}
