import {ListComponent} from "components/lists/list.component";
import Api from "modules/Api/Api.module";
import {Exam} from "modules/Api/Model/Exam";
import {ExamQuery} from "modules/Api/Model/Exam/Exam.Service";
import {Training} from "modules/Api/Model/Training";
import {COLUMNS, DATE_FORMAT, EDITABLE_TYPES} from "modules/DataTable/Constants";
import {Column} from "modules/DataTable/models/Column";
import {Observable} from "rxjs";

export class ExamList extends ListComponent<Exam> {
  public training: Training = null;
  public data: {
    addButtonDisplayed: boolean,
  } = {
    addButtonDisplayed: true,
  };
  protected service = Api.examService;
  protected query: ExamQuery = new ExamQuery();
  protected columns: Column[] = [
    // new Column(COLUMNS.LABEL("Intitulé", "label"), EDITABLE_TYPES.textInput),
    new Column(COLUMNS.DATE_TIME("Date", "dateTime", DATE_FORMAT), EDITABLE_TYPES.dateInput),
    new Column({title: "Type", data: "examType", render: (examType) => (examType !== null) ? examType.label : ""}, EDITABLE_TYPES.select, {
      options$: Api.examTypeService.fetchAll$,
      emptyLabel: "-- Type --",
    }),
    new Column(COLUMNS.EDIT),
    new Column(COLUMNS.DELETE),
  ];

  public get dataSource$(): Observable<Exam[]> {
    return this.training.exams$;
  }

  public createAction = () => {
    this.query.training = this.training;
    return Api.examService.createByQuery(this.query);
  }
}

export default ExamList;
