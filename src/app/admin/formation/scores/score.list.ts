import {ListComponent} from "components/lists/list.component";
import Api from "modules/Api/Api.module";
import {Exam} from "modules/Api/Model/Exam";
import {ExamScore} from "modules/Api/Model/ExamScore";
import {Trainee} from "modules/Api/Model/Trainee";
import {Training} from "modules/Api/Model/Training";
import {COLUMNS, EDITABLE_TYPES} from "modules/DataTable/Constants";
import {Column} from "modules/DataTable/models/Column";
import {takeUntil} from "rxjs/operators";
import {AverageManager} from "./average.manager";

export class ScoreList extends ListComponent<Trainee> {
  public training: Training = null;
  protected propertiesUpdatingList = ["score"];

  public render() {
    AverageManager.prepare$(this.training.formation).pipe(
      takeUntil(this.close$),
    ).subscribe(() => {
      this.setColumns(this.training.exams);
      this.dataSource$ = Api.traineeService.getByFormation(this.training.formation);
      super.render();
    });
  }

  protected setColumns(exams: Exam[]): void {
    this.columns = [new Column(COLUMNS.LABEL("Étudiant", "label"))];
    exams.forEach((exam: Exam) => {
      let colLabel =  "<span style=\"color: red\">N/A</span>";
      if (exam.examType !== null) {
        colLabel = exam.examType.label + " <sup>(" + exam.coefficient.toString() + ")</sup>";
      }
      const TRAINEE_SCORE = {
        title: colLabel, data: null, width: "40px", className: "align-center",
        render: (trainee: Trainee) => this.getScoreLabel(exam.getScoreByTrainee(trainee)),
      };
      this.columns.push(
        new Column(TRAINEE_SCORE, EDITABLE_TYPES.numberInput, {
          editedObject: (trainee: Trainee) => exam.getScoreByTrainee(trainee),
          editedValue: "score",
          updateAction: (score: ExamScore) => Api.examScoreService.update(score),
        }),
      );
    });
    const AVERAGE = {
      title: "Moy.", data: null, width: "40px", className: "align-center dark", sortable: false,  render:
        (trainee: Trainee) => this.getAverageLabel(AverageManager.averageByTraining(trainee, this.training)),
    };
    this.columns.push(new Column(AVERAGE));
  }

  protected  getScoreLabel(examScore: ExamScore): string {
    return (examScore && examScore.score !== null) ? examScore.score.toString() : "--";
  }

  protected getAverageLabel(average: number) {
    return (average !== null) ? (Math.round(average * 100) / 100).toString() : "";
  }
}

export default ScoreList;
