import DefaultExamList from "app/_common/lists/exam.list";
import {COLUMNS} from "modules/DataTable/Constants";
import {Column} from "modules/DataTable/models/Column";

export class ExamList extends DefaultExamList {
  protected columns: Column[] = this.columns.concat([
    new Column(COLUMNS.EDIT),
    new Column(COLUMNS.DELETE),
  ]);
}
export default ExamList;
