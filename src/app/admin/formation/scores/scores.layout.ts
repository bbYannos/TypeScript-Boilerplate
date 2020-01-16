import Api from "modules/Api/Api.module";
import {Formation} from "modules/Api/Model/Formation";
import {Training, TrainingQuery} from "modules/Api/Model/Training/Training.Service";
import {from, Subject} from "rxjs";
import {switchMap, takeUntil, tap} from "rxjs/operators";
import {Component, Vue, VueComponent} from "shared/vue";
import {Store} from "../../_store";
import WithRender from "./scores.layout.html";

@WithRender
@Component
export class ScoresLayout extends Vue implements VueComponent {
  public formation: Formation = null;
  public trainings: Training[] = [];
  public scoreList$ = () =>  from(import(/* webpackChunkName: "admin" */ "./score.list"));
  public examList$ = () =>  from(import(/* webpackChunkName: "admin" */ "./exam.list"));

  protected close_: Subject<void> = new Subject();

  public mounted(): void {
    const trainingQuery = new TrainingQuery();
    trainingQuery.canHaveExams = true;
    Store.formation_.pipe(takeUntil(this.close_)).pipe(
      tap((formation: Formation) => {
        this.formation = formation;
        trainingQuery.formation = formation;
      }),
      switchMap(() => Api.trainingService.list(trainingQuery)),
    ).subscribe((trainings: Training[]) => {
      // todo: tricky
      this.trainings = [];
      this.$nextTick(() => {
        this.trainings = trainings;
      });
    });
  }

  public beforeDestroy(): void {
    this.close_.next();
    this.close_.complete();
  }
}