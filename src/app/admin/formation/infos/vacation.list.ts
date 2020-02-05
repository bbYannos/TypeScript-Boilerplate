import {ListComponent} from "components/lists/list.component";
import Api from "modules/Api/Api.module";
import {Availability} from "modules/Api/Model/Availability";
import {AvailabilityQuery} from "modules/Api/Model/Availability/Availability.Service";
import {Formation} from "modules/Api/Model/Formation";
import {COLUMNS, DATE_FORMAT, EDITABLE_TYPES} from "modules/DataTable/Constants";
import {Column} from "modules/DataTable/models/Column";
import {switchMap, tap} from "rxjs/operators";
import {Store} from "../../_store";

export class VacationList extends ListComponent<Availability> {
  public data = {
    addButtonDisplayed: true,
  };
  protected service = Api.availabilityService;
  protected query = new AvailabilityQuery();

  protected columns = [
    new Column(COLUMNS.LABEL("Titre", "label"), EDITABLE_TYPES.textInput),
    new Column(COLUMNS.DATE_TIME("Deb.", "startTime", DATE_FORMAT), EDITABLE_TYPES.dateInput),
    new Column(COLUMNS.DATE_TIME("Fin", "endTime", DATE_FORMAT), EDITABLE_TYPES.dateInput),
    new Column(COLUMNS.CHECK_BOX("Global ?", "global"), null),
    new Column(COLUMNS.DELETE),
  ];

  protected _dataSource$ = Store.formation_.pipe(
    tap((formation: Formation) => {
      // avoid highlight of all rows
      if (this._dataTable) {
        this._dataTable.currentObjects = null;
      }
      this.loading_.next(true);
      this.query.open = false;
      this.query.setParentAndClass(formation);
    }),
    switchMap((formation) => formation.allVacations$),
  );

  public createAction = () => Api.availabilityService.createByQuery(this.query);
}

export default VacationList;
