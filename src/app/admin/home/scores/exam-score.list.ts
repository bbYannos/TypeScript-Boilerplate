import {ListComponent} from "components/lists/list.component";
import Api from "modules/Api/Api.module";
import {Exam, ExamQuery} from "modules/Api/Model/Exam/Exam.Service";
import {ExamScore} from "modules/Api/Model/ExamScore";
import {Trainee} from "modules/Api/Model/Trainee";
import {COLUMNS, EDITABLE_TYPES} from "modules/DataTable/Constants";
import {Column} from "modules/DataTable/models/Column";
import {map, switchMap} from "rxjs/operators";

export class ExamTypeList extends ListComponent<ExamScore> {
  public exam: Exam = null;
  protected service = Api.examScoreService;
  protected query: ExamQuery = new ExamQuery();
  protected columns: Column[] = [
    new Column(COLUMNS.LABEL("Étudiant", "trainee.label")),
    new Column({
      title: "Note", data: "score", width: "40px", className: "align-center",
      render: (score: number) => (score !== null) ? score.toString() : "--",
    }, EDITABLE_TYPES.numberInput),
  ];

  public render() {
    this.dataSource$ = Api.traineeService.getByFormation(this.exam.training.formation).pipe(
      switchMap((trainees: Trainee[]) => this.exam.scores$.pipe(map(() => trainees))),
      map((trainees: Trainee[]) => trainees.map((trainee: Trainee) => this.exam.getScoreByTrainee(trainee))),
    );
    super.render();
  }
}

export default ExamTypeList;
