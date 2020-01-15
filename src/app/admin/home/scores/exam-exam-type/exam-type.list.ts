import {ListComponent} from "components/lists/list.component";
import Api from "modules/Api/Api.module";
import {ExamQuery} from "modules/Api/Model/Exam/Exam.Service";
import {ExamType} from "modules/Api/Model/ExamType";
import {Training} from "modules/Api/Model/Training";
import {COLUMNS, EDITABLE_TYPES} from "modules/DataTable/Constants";
import {Column} from "modules/DataTable/models/Column";

export class ExamTypeList extends ListComponent<ExamType> {
  public training: Training = null;
  public data: {
    addButtonDisplayed: boolean,
  } = {
    addButtonDisplayed: true,
  };
  protected service = Api.examTypeService;
  protected query: ExamQuery = new ExamQuery();
  protected columns: Column[] = [
    new Column(COLUMNS.LABEL("Intitulé", "label"), EDITABLE_TYPES.textInput),
    new Column(COLUMNS.NUMBER("Coeff.", "coefficient"), EDITABLE_TYPES.numberInput),
    new Column(COLUMNS.DELETE),
  ];
}

export default ExamTypeList;
