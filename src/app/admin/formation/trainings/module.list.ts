import {ListComponent} from "components/lists/list.component";
import Api from "modules/Api/Api.module";
import {Formation} from "modules/Api/Model/Formation";
import {Module, ModuleQuery} from "modules/Api/Model/Module";
import {COLUMNS, EDITABLE_TYPES} from "modules/DataTable/Constants";
import {Column} from "modules/DataTable/models/Column";
import {switchMap, tap} from "rxjs/operators";
import {Store} from "../../_store";

// noinspection JSUnusedGlobalSymbols
export class ModuleList extends ListComponent<Module> {
  public data: {
    addButtonDisplayed: boolean,
  } = {
    addButtonDisplayed: true,
  };

  protected service = Api.moduleService;
  protected query = new ModuleQuery();

  protected columns = [
    new Column(COLUMNS.LABEL("Intitulé", "label"), EDITABLE_TYPES.textInput),
    new Column(COLUMNS.NUMBER("Coeff.", "coefficient"), EDITABLE_TYPES.numberInput),
    new Column(COLUMNS.COLOR("color"), EDITABLE_TYPES.colorPicker),
    new Column(COLUMNS.DELETE),
  ];

  public render() {
    this.dataSource$ = Store.formation_.pipe(
      tap((formation: Formation) => {
        // avoid highlight of all rows
        if (this._dataTable) {
          this._dataTable.currentObjects = null;
        }
        this.loading_.next(true);
        this.query.formation = formation;
      }),
      switchMap((formation) => formation.modules$),
    );
    this.createAction = () => Api.moduleService.createByQuery(this.query);
    super.render();
  }
}

export default ModuleList;
