import {ListComponent} from "components/lists/list.component";
import Api from "modules/Api/Api.module";
import {Availability} from "modules/Api/Model/Availability";
import {AvailabilityQuery} from "modules/Api/Model/Availability/Availability.Service";
import {Formation} from "modules/Api/Model/Formation";
import {COLUMNS, DATE_FORMAT, EDITABLE_TYPES} from "modules/DataTable/Constants";
import {Column} from "modules/DataTable/models/Column";
import {takeUntil} from "rxjs/operators";
import {Store} from "./_store";

export class VacationList extends ListComponent<Availability> {
  public data = {
    addButtonDisplayed: true,
  };
  protected formation: Formation = null;
  protected service = Api.availabilityService;
  protected columns = [
    new Column(COLUMNS.LABEL("Titre", "label"), EDITABLE_TYPES.textInput),
    new Column(COLUMNS.DATE_TIME("Deb.", "startTime", DATE_FORMAT), EDITABLE_TYPES.dateInput),
    new Column(COLUMNS.DATE_TIME("Fin", "endTime", DATE_FORMAT), EDITABLE_TYPES.dateInput),
    new Column(COLUMNS.CHECK_BOX("Global ?", "global"), null),
    new Column(COLUMNS.DELETE),
  ];

  public render() {
    Store.formation_.pipe(takeUntil(this.close$)).subscribe((formation: Formation) => {
      this.formation = formation;
      const query = new AvailabilityQuery();
      query.setParentAndClass(formation);
      query.open = false;
      this.dataSource$ = formation.allVacations$;
      this.createAction = () => Api.availabilityService.createByQuery(query);
      super.render();
      this._dataTable.propertiesUpdatingList = ["label", "startTime", "endTime", "global"];
    });
  }
}

export default VacationList;
