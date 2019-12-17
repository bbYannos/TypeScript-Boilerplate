import Api from "modules/Api/Api.module";
import {COLUMNS, EDITABLE_TYPES} from "modules/DataTable/Constants";
import {Column, DataTableEditable} from "modules/DataTable/module";
import {Observable} from "rxjs";
import {Formation} from "modules/Api/Model/Formation";

export class List {
  public $htmlEl: HTMLElement;
  public close$: Observable<any>;

  public render() {
    const table = new DataTableEditable();
    table.columns = [
      new Column(COLUMNS.LABEL("Nom", "label", 80), EDITABLE_TYPES.textInput),
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

