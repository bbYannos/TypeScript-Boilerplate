import {ListComponent} from "components/lists/list.component";
import Api from "modules/Api/Api.module";
import {Absence, AbsenceQuery} from "modules/Api/Model/Absence/Absence.Service";
import {Trainee} from "modules/Api/Model/Trainee";
import {COLUMNS, EDITABLE_TYPES} from "modules/DataTable/Constants";
import {Column} from "modules/DataTable/models/Column";
import {switchMap, tap} from "rxjs/operators";
import moment from "shared/moment";
import {Store} from "../../_store";

const DELAY_DURATION = {
  title: "Durée",
  data: "duration",
  render: (data: moment.Duration) => data.asMinutes().toString(),
  width: "40px",
  className: "align-center",
};

const DELAY_TOTAL = {
  title: "Total", data: "trainee",
  render: (trainee: Trainee) => trainee.delays.length.toString() + " <i>(" + trainee.delaysDuration.format("HH:mm", {trim: false}) + ")</i>",
  width: "40px", className: "align-center",
};

export class DelayList extends ListComponent<Absence> {
  public data: {
    addButtonDisplayed: boolean,
  } = {
    addButtonDisplayed: true,
  };

  protected service = Api.absenceService;
  protected query = new AbsenceQuery();

  protected _dataSource$ = Store.trainee_.pipe(
    tap((trainee: Trainee) => {
      // avoid highlight of all rows
      if (this._dataTable) {
        this._dataTable.currentObjects = null;
      }
      this.loading_.next(true);
      this.query.trainee = trainee;
    }),
    switchMap((trainee) => trainee.delays$),
  );

  protected columns = [
    new Column(COLUMNS.DATE_TIME("Date", "startTime"), EDITABLE_TYPES.dateTimeInput),
    new Column(DELAY_DURATION, EDITABLE_TYPES.durationInput, {durationFormat: "mm"}),
    new Column(DELAY_TOTAL),
    new Column(COLUMNS.DELETE),
  ];

  public render() {
    this.query.delay = true;
    super.render();
  }

  public createAction = () => Api.absenceService.createByQuery(this.query);
}

export default DelayList;
