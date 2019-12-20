import {ListComponent} from "components/lists/list.component";
import Api from "modules/Api/Api.module";
import {Formation} from "modules/Api/Model/Formation";
import {Module, ModuleQuery} from "modules/Api/Model/Module";
import {COLUMNS, EDITABLE_TYPES} from "modules/DataTable/Constants";
import {Column} from "modules/DataTable/models/Column";
import {takeUntil} from "rxjs/operators";
import {Store} from "./_store";

// noinspection JSUnusedGlobalSymbols
export class ModuleList extends ListComponent<Module> {
  public data: {
    addButtonDisplayed: boolean,
  } = {
    addButtonDisplayed: true,
  };

  protected formation: Formation = null;
  protected service = Api.moduleService;

  protected getColumns() {
    return [
      new Column(COLUMNS.LABEL("Intitulé", "label"), EDITABLE_TYPES.textInput),
      new Column(COLUMNS.NUMBER("Coeff.", "coefficient"), EDITABLE_TYPES.numberInput),
      new Column(COLUMNS.COLOR("color"), EDITABLE_TYPES.colorPicker),
      new Column(COLUMNS.DELETE),
    ];
  }

  public render() {
    Store.formation_.pipe(takeUntil(this.close$)).subscribe((formation: Formation) => {
      this.formation = formation;
      this.columns = this.getColumns();
      const query = new ModuleQuery();
      query.formation = formation;
      this.dataSource$ = formation.modules$;
      this.createAction = () => Api.moduleService.createByQuery(query);
      super.render();
    });
  }
}

export default ModuleList;
