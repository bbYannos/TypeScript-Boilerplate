import Api from "modules/Api/Api.module";
import {Formation} from "modules/Api/Model/Formation";
import {COLUMNS, DATE_FORMAT, EDITABLE_TYPES} from "modules/DataTable/Constants";
import {Column, DataTableEditable} from "modules/DataTable/module";
import {Observable} from "rxjs";

export class List {
  public $htmlEl: HTMLElement;
  public close$: Observable<any>;

  public render() {
    const table = new DataTableEditable();
    table.columns = [
      new Column(COLUMNS.LABEL("Nom", "label", 80), EDITABLE_TYPES.textInput),
      new Column(COLUMNS.DATE_TIME("Deb.", "startTime", DATE_FORMAT), EDITABLE_TYPES.dateInput),
      new Column(COLUMNS.TIME("Cours", "defaultDuration"), EDITABLE_TYPES.durationInput),
    ];

    table.$htmEl = this.$htmlEl;
    table.close$ = this.close$;
    table.setDataSource$(Api.formationService.fetchAll$);
    table.updateAction = (object: Formation) => {
      return Api.formationService.update(object);
    };
  }
}

export default {ListComponent: List};

