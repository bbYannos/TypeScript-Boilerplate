import {CardPlugin, TabsPlugin} from "bootstrap-vue";
import {from} from "rxjs";
import {Component, Vue} from "shared/vue";
import WithRender from "./synthesis.layout.html";

Vue.use(TabsPlugin);
Vue.use(CardPlugin);

@WithRender
@Component
export class SynthesisLayout extends Vue {
  public synthesisList$ = () =>  from(import(/* webpackChunkName: "admin" */ "./synthesis.list"));
}
