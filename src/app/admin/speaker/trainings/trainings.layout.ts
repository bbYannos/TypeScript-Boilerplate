import {CardPlugin} from "bootstrap-vue";
import {from} from "rxjs";
import {Component, Vue} from "shared/vue";
import WithRender from "./trainings.layout.html";

Vue.use(CardPlugin);

@WithRender
@Component
export class TrainingsLayout extends Vue {
  public trainingList$ = () =>  from(import(/* webpackChunkName: "admin" */ "./training.list"));
}
