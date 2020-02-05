import {ListComponent} from "components/lists/list.component";
import Api from "modules/Api/Api.module";
import {Absence, AbsenceQuery} from "modules/Api/Model/Absence/Absence.Service";
import {Trainee} from "modules/Api/Model/Trainee";
import {COLUMNS, EDITABLE_TYPES} from "modules/DataTable/Constants";
import {Column} from "modules/DataTable/models/Column";
import {map} from "rxjs/operators";

export const UNJUSTIFIED_ABSENCES = {
  title: "Non just.", data: "trainee.unjustifiedAbsences.length",
  render: (data) => (Number(data) < 2) ? data : '<b class="text-danger">' + data + "</b>",
  width: "40px", className: "align-center",
};

export class AbsenceList extends ListComponent<Absence> {
  protected service = Api.absenceService;
  protected _dataSource$ = Api.absenceService.fetchAll$.pipe(
    map((absences: Absence[]) =>
      absences
      .filter((absence) => !absence.delay)
      .sort((abs1, abs2) => (abs1.createdAt > abs2.createdAt) ? -1 : 1),
    ),
  );
  protected query = new AbsenceQuery();
  protected overrideOptions = {...this.defaultPagingOptions, ...{searching: false}};
  protected columns = [
    new Column(COLUMNS.DATE_TIME("Date", "startTime"), EDITABLE_TYPES.dateTimeInput),
    new Column(COLUMNS.LABEL("Nom", "trainee.label")),
    new Column(COLUMNS.DATE_TIME("Fin", "endTime"), EDITABLE_TYPES.dateTimeInput),
    new Column(COLUMNS.NUMBER("Abs. total", "trainee.absences.length")),
    new Column(UNJUSTIFIED_ABSENCES),
    new Column(COLUMNS.DELETE),
  ];

  public createAction = (trainee: Trainee) => {
    const absenceQuery = new AbsenceQuery();
    absenceQuery.trainee = trainee;
    absenceQuery.delay = false;
    return Api.absenceService.createByQuery(absenceQuery);
  }
}

export default AbsenceList;
