import {ListComponent} from "components/lists/list.component";
import Api from "modules/Api/Api.module";
import {Exam, ExamQuery} from "modules/Api/Model/Exam/Exam.Service";
import {ExamScore} from "modules/Api/Model/ExamScore";
import {COLUMNS, EDITABLE_TYPES} from "modules/DataTable/Constants";
import {Column} from "modules/DataTable/models/Column";

export class ExamTypeList extends ListComponent<ExamScore> {
  public exam: Exam = null;
  
  protected service = Api.examScoreService;
  protected query: ExamQuery = new ExamQuery();
  protected columns: Column[] = [
    new Column(COLUMNS.LABEL("Étudiant", "trainee.label")),
    new Column(COLUMNS.NUMBER("Note", "score"), EDITABLE_TYPES.numberInput),
  ];

  public render() {
    this.dataSource$ = Api.examScoreService.getByExam(this.exam);
    super.render();
  }
}

export default ExamTypeList;
