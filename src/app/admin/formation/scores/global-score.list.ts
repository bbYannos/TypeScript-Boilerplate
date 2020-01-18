import {ListComponent} from "components/lists/list.component";
import Api from "modules/Api/Api.module";
import {Formation} from "modules/Api/Model/Formation";
import {Module} from "modules/Api/Model/Module";
import {Trainee} from "modules/Api/Model/Trainee";
import {Training, TrainingQuery} from "modules/Api/Model/Training/Training.Service";
import {COLUMNS} from "modules/DataTable/Constants";
import {Column} from "modules/DataTable/models/Column";
import {switchMap, takeUntil, tap} from "rxjs/operators";
import {Store} from "../../_store";
import {AverageManager} from "./average.manager";

class GlobalScoreList extends ListComponent<Trainee> {
  public render() {
    const trainingQuery = new TrainingQuery();
    trainingQuery.canHaveExams = true;
    Store.formation_.pipe(
      tap(() => this.loading_.next(true)),
      switchMap((formation: Formation) => AverageManager.prepare$(formation)),
      takeUntil(this.close$),
    ).subscribe((formation: Formation) => {
      this.setColumns(AverageManager.trainings);
      this.dataSource$ = Api.traineeService.getByFormation(formation);
      super.render();
    });
  }

  protected setColumns(trainings: Training[]): void {
    this.columns = [new Column(COLUMNS.LABEL("Étudiant", "label"))];
    let module = null;
    trainings.forEach((training: Training) => {
      if (module !== null && !training.module.isSame(module)) {
        this.columns.push(this.moduleColumn(module));
      }
      this.columns.push(this.trainingColumn(training));
      module = training.module;
    });
    if (module !== null) {
      this.columns.push(this.moduleColumn(module));
    }
    const AVERAGE = {
      title: "Moy.", data: null, width: "40px", className: "align-center dark", sortable: false,
      render: (trainee: Trainee) => this.getAverageLabel(AverageManager.averageByFormation(trainee)),
    };
    this.columns.push(new Column(AVERAGE));
  }

  protected moduleColumn(module: Module) {
    return  new Column({
      title: module.label.substring(0, 3) + " <sup>(" + module.coefficient.toString() + ")</sup>",
      data: null,
      width: "40px",
      class: "align-center  light-dark",
      sortable: false,
      render: (trainee) => AverageManager.averageByModuleTrainings(trainee, module),
    });
  }

  protected trainingColumn(training: Training) {
    return  new Column({
      title: training.label.substring(0, 3),
      data: null,
      width: "40px",
      class: "align-center",
      sortable: false,
      render: (trainee) => AverageManager.averageByTraining(trainee, training),
    });
  }

  protected getAverageLabel(average: number) {
    return (average !== null) ? (Math.round(average * 100) / 100).toString() : "";
  }
}

export default GlobalScoreList;
