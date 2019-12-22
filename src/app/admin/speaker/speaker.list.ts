import {ListComponent} from "components/lists/list.component";
import Api from "modules/Api/Api.module";
import {Speaker} from "modules/Api/Model/Speaker";
import {COLUMNS, EDITABLE_TYPES} from "modules/DataTable/Constants";
import {Column} from "modules/DataTable/models/Column";

export class SpeakerList extends ListComponent<Speaker> {
  public data = {
    addButtonDisplayed: true,
  };
  protected service = Api.speakerService;
  protected overrideOptions = this.defaultPagingOptions;

  protected columns = [
    new Column(COLUMNS.LABEL("Nom", "lastName"), EDITABLE_TYPES.textInput),
    new Column(COLUMNS.LABEL("Prénom", "firstName", 80), EDITABLE_TYPES.textInput),
    new Column(COLUMNS.LABEL("Email", "email", 150), EDITABLE_TYPES.textInput),
    new Column(COLUMNS.EDIT),
    new Column(COLUMNS.DELETE),
  ];

  public editAction = (speaker: Speaker) => {
    this.$router.push("/speakers/" + speaker.identifier);
  };
}

export default SpeakerList;
