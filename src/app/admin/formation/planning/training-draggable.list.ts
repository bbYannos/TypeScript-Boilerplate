import {Draggable} from "@fullcalendar/interaction";
import {Formation} from "modules/Api/Model/Formation";
import {Speaker} from "modules/Api/Model/Speaker";
import {Training} from "modules/Api/Model/Training";
import {combineLatest, Subject} from "rxjs";
import {switchMap, takeUntil} from "rxjs/operators";
import {Component, Vue, VueComponent} from "shared/vue";
import {Store} from "../../_store";
import WithRender from "./training-draggable.list.html";
import "./training-draggable.list.scss";

@WithRender
@Component
export class TrainingDraggableList extends Vue implements VueComponent {
  public trainings: Training[] = [];
  public $refs: { container: HTMLElement, wrapper: HTMLElement } = {container: null, wrapper: null};

  protected close_: Subject<void> = new Subject<void>();
  protected draggable: Draggable = null;

  public mounted(): void {
    Store.formation_.pipe(
      switchMap((formation: Formation) => combineLatest([formation.sessions$, formation.trainings$])),
      takeUntil(this.close_),
    ).subscribe(([sessions, trainings]) => {
      this.trainings = trainings.filter((training: Training) => training.speaker !== null && training.remainingDuration.asMinutes() !== 0);
      this.$nextTick(() => {
        if (this.draggable !== null) {
          this.draggable.destroy();
        }
        if (trainings.length === 0) {
          return;
        }
        this.draggable = new Draggable(this.$refs.wrapper, {
          itemSelector: ".fc-event",
          eventData: (eventEl: HTMLElement) => {
            return {
              title: eventEl.innerText,
              color: eventEl.style.backgroundColor,
            };
          },
          appendTo: this.$refs.container,
        });
      });
    });
  }

  public destroyed(): void {
    this.close_.next();
  }

  public changeSpeaker(speaker: Speaker) {
    this.$emit("speaker", speaker);
  }
}

Vue.component("training-draggable-list", TrainingDraggableList);
