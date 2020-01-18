import {ListComponent} from "components/lists/list.component";
import Api from "modules/Api/Api.module";
import {Exam} from "modules/Api/Model/Exam";
import {ExamQuery} from "modules/Api/Model/Exam/Exam.Service";
import {Training} from "modules/Api/Model/Training";
import {COLUMNS, DATE_FORMAT, EDITABLE_TYPES} from "modules/DataTable/Constants";
import {Column} from "modules/DataTable/models/Column";

export class ExamList extends ListComponent<Exam> {

  public data: {
    addButtonDisplayed: boolean,
  } = {
    addButtonDisplayed: true,
  };
  protected service = Api.examService;
  protected query: ExamQuery = new ExamQuery();
  protected columns: Column[] = [
    new Column(COLUMNS.DATE_TIME("Date", "dateTime", DATE_FORMAT), EDITABLE_TYPES.dateInput),
    new Column({title: "Type", data: "examType", render: (examType) => (examType !== null) ? examType.label : ""}, EDITABLE_TYPES.select, {
      options$: Api.examTypeService.fetchAll$,
      emptyLabel: "-- Type --",
    }),
  ];

  public set training(training: Training) {
    this.query.training = training;
    this._dataSource$ = training.exams$;
  }

  public createAction = () => {
    return Api.examService.createByQuery(this.query);
  }
}

export default ExamList;
