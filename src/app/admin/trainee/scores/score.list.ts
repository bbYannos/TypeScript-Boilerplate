import {ListComponent} from "components/lists/list.component";
import Api from "modules/Api/Api.module";
import {ExamScore} from "modules/Api/Model/ExamScore";
import {Trainee} from "modules/Api/Model/Trainee";
import {COLUMNS, DATE_FORMAT} from "modules/DataTable/Constants";
import {Column} from "modules/DataTable/models/Column";
import {switchMap, tap} from "rxjs/operators";
import {Store} from "../../_store";


export class ScoreList extends ListComponent<ExamScore> {
  public data: {
    addButtonDisplayed: boolean,
  } = {
    addButtonDisplayed: true,
  };

  protected service = Api.examScoreService;

  protected columns = [
    new Column(COLUMNS.DATE_TIME("Date", "exam.label", DATE_FORMAT)),
    new Column(COLUMNS.LABEL("Exam", "exam.training.label")),
    new Column(COLUMNS.LABEL("Exam", "exam.label")),
    new Column(COLUMNS.NUMBER("Note", "score")),
  ];

  public render() {
    this.dataSource$ = Store.trainee_.pipe(
      tap((trainee: Trainee) => {
        // avoid highlight of all rows
        if (this._dataTable) {
          this._dataTable.currentObjects = null;
        }
        this.loading_.next(true);
      }),
      switchMap((trainee: Trainee) => Api.examScoreService.getByTrainee(trainee)),
    );
    super.render();
  }
}

export default ScoreList;
