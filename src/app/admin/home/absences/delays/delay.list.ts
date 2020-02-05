import {ListComponent} from "components/lists/list.component";
import Api from "modules/Api/Api.module";
import {Absence} from "modules/Api/Model/Absence";
import {AbsenceQuery} from "modules/Api/Model/Absence/Absence.Service";
import {Trainee} from "modules/Api/Model/Trainee";
import {COLUMNS, EDITABLE_TYPES} from "modules/DataTable/Constants";
import {Column} from "modules/DataTable/models/Column";
import {map} from "rxjs/operators";
import moment from "shared/moment";

const DELAY_DURATION = {
  title: "Durée",
  data: "duration",
  render: (data: moment.Duration) => data.asMinutes().toString(),
  width: "40px",
  className: "align-center",
};

export const DELAY_TOTAL = {
  title: "Total", data: "trainee",
  render: (trainee: Trainee) => trainee.delays.length.toString() + " <i>(" + trainee.delaysDuration.format("HH:mm", {trim: false}) + ")</i>",
  width: "40px", className: "align-center",
};

export class DelayList extends ListComponent<Absence> {
  protected service = Api.absenceService;
  protected _dataSource$ = Api.absenceService.fetchAll$.pipe(
    map((absences: Absence[]) =>
      absences
      .filter((absence) => absence.delay)
      .sort((abs1, abs2) => (abs1.createdAt > abs2.createdAt) ? -1 : 1),
    ),
  );
  protected query = new AbsenceQuery();
  protected overrideOptions = {...this.defaultPagingOptions, ...{searching: false}};
  protected columns = [
    new Column(COLUMNS.DATE_TIME("Date", "startTime"), EDITABLE_TYPES.dateTimeInput),
    new Column(COLUMNS.LABEL("Nom", "trainee.label")),
    new Column(DELAY_DURATION, EDITABLE_TYPES.durationInput, {durationFormat: "mm"}),
    new Column(DELAY_TOTAL),
    new Column(COLUMNS.DELETE),
  ];

  public createAction = (trainee: Trainee) => {
    const absenceQuery = new AbsenceQuery();
    absenceQuery.trainee = trainee;
    absenceQuery.delay = true;
    /* todo: define startTime of current training and set duration with current time */
    return Api.absenceService.createByQuery(absenceQuery);
  }
}

export default DelayList;
