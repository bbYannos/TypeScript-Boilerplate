import {ListComponent} from "components/lists/list.component";
import Api from "modules/Api/Api.module";
import {Absence, AbsenceQuery} from "modules/Api/Model/Absence/Absence.Service";
import {Trainee} from "modules/Api/Model/Trainee";
import {COLUMNS, EDITABLE_TYPES} from "modules/DataTable/Constants";
import {Column} from "modules/DataTable/models/Column";
import {switchMap, tap} from "rxjs/operators";
import {Store} from "../../_store";

export class AbsenceList extends ListComponent<Absence> {
  public data: {
    addButtonDisplayed: boolean,
  } = {
    addButtonDisplayed: true,
  };

  protected service = Api.absenceService;
  protected query = new AbsenceQuery();
  public createAction = () => Api.absenceService.createByQuery(this.query);

  protected columns = [
    new Column(COLUMNS.DATE_TIME("Date", "startTime"), EDITABLE_TYPES.dateTimeInput),
    new Column(COLUMNS.DATE_TIME("Fin", "endTime"), EDITABLE_TYPES.dateTimeInput),
    new Column(COLUMNS.CHECK_BOX("Just.", "justified"), EDITABLE_TYPES.checkBox),
    new Column({title: "Justification", data: "justification"}, EDITABLE_TYPES.textInput),
    new Column(COLUMNS.DELETE),
  ];

  public render() {
    this.query.delay = false;
    this.dataSource$ = Store.trainee_.pipe(
      tap((trainee: Trainee) => {
        // avoid highlight of all rows
        if (this._dataTable) {
          this._dataTable.currentObjects = null;
        }
        this.loading_.next(true);
        this.query.trainee = trainee;
      }),
      switchMap((trainee) => trainee.absences$),
    );
    super.render();
  }
}

export default AbsenceList;
