import {CardPlugin} from "bootstrap-vue";
import {CalendarWrapper} from "components/calendar/calendar-wrapper";
import {Speaker} from "modules/Api/Model/Speaker";
import {BehaviorSubject, from, Observable} from "rxjs";
import {Component, Vue, VueComponent} from "shared/vue";
import WithRender from "./planning.layout.html";
import {TrainingDraggableList} from "./training-draggable.list";

Vue.use(CardPlugin);

@WithRender
@Component({components: {CalendarWrapper, TrainingDraggableList}})
export class PlanningLayout extends Vue implements VueComponent {
  public $refs: { trainingList: TrainingDraggableList } = {trainingList: null};
  public speaker_: BehaviorSubject<Speaker> = new BehaviorSubject<Speaker>(null);
  public planning$ = () => from(import(/* webpackChunkName: "admin" */ "./planning-calendar"));

  public mounted(): void {}
}
