import {ListComponent} from "components/lists/list.component";
import Api from "modules/Api/Api.module";
import {Exam} from "modules/Api/Model/Exam";
import {ExamScore} from "modules/Api/Model/ExamScore";
import {Trainee} from "modules/Api/Model/Trainee";
import {Training} from "modules/Api/Model/Training";
import {COLUMNS, EDITABLE_TYPES} from "modules/DataTable/Constants";
import {Column} from "modules/DataTable/models/Column";
import {combineLatest, of} from "rxjs";
import {map, switchMap, take, tap} from "rxjs/operators";

export class ScoreList extends ListComponent<Trainee> {
  public training: Training = null;

  public render() {
    this.training.exams$.pipe(
      take(1),
    ).subscribe((_exams) => {
      this.setColumns(_exams);
      this.dataSource$ =  this.training.exams$.pipe(
        switchMap((exams: Exam[]) => {
          const populateScore$ = (exams.length) ? combineLatest(exams.map((exam) => exam.scores$)) : of([]);
          return populateScore$.pipe(map(() => exams));
        }),
        switchMap(() => Api.traineeService.getByFormation(this.training.formation)),
      );
      super.render();
      this.dataTable.propertiesUpdatingList = ["score"];
    });
  }

  protected setColumns(exams: Exam[]): void {
    this.columns = [new Column(COLUMNS.LABEL("Étudiant", "label"))];
    exams.forEach((exam: Exam) => {
      const TRAINEE_SCORE = {
        title: exam.label, data: null, width: "40px", className: "align-center",
        render: (trainee: Trainee) => this.getScoreLabel(exam, trainee),
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
      title: "Moy.", data: null, width: "40px", render:
        (trainee: Trainee) => this.getAverageLabel(this.training.getAverageByTrainee(trainee)),
    };
    this.columns.push(new Column(AVERAGE));
  }

  protected  getScoreLabel(exam: Exam, trainee: Trainee): string {
    const examScore = exam.getScoreByTrainee(trainee);
    const score = (examScore && examScore.score !== null) ? examScore.score.toString() : "--";
    return score + " <sup>(" + exam.coefficient.toString() + ")</sup>";
  }

  protected getAverageLabel(average: number) {
    return (average) ? (Math.round(average * 100) / 100).toString() : "";
  }
}

export default ScoreList;
