import {ListComponent} from "components/lists/list.component";
import Api from "modules/Api/Api.module";
import {Formation} from "modules/Api/Model/Formation";
import {COLUMNS, DATE_FORMAT, EDITABLE_TYPES} from "modules/DataTable/Constants";
import {Column} from "modules/DataTable/models/Column";

export class FormationList extends ListComponent<Formation> {
  public data = {
    addButtonDisplayed: true,
  };
  protected service = Api.formationService;
  protected columns = [
    new Column(COLUMNS.LABEL("Nom", "label", 80), EDITABLE_TYPES.textInput),
    new Column(COLUMNS.DATE_TIME("Deb.", "startTime", DATE_FORMAT), EDITABLE_TYPES.dateInput),
    new Column(COLUMNS.DATE_TIME("Fin", "endTime", DATE_FORMAT), EDITABLE_TYPES.dateInput),
    new Column(COLUMNS.TIME("Cours", "defaultDuration"), EDITABLE_TYPES.durationInput),
    new Column(COLUMNS.EDIT),
    new Column(COLUMNS.DELETE),
  ];
  
  public editAction = (formation: Formation) => {
    this.$router.push("/formations/" + formation.identifier);
  };
}

export default FormationList;
