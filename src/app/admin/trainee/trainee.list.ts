import {ListComponent} from "components/lists/list.component";
import Api from "modules/Api/Api.module";
import {Formation} from "modules/Api/Model/Formation";
import {COLUMNS, EDITABLE_TYPES} from "modules/DataTable/Constants";
import {Column} from "modules/DataTable/models/Column";
import {Trainee} from "modules/Api/Model/Trainee";

export class TraineeList extends ListComponent<Trainee> {
  public data = {
    addButtonDisplayed: true,
  };
  protected service = Api.traineeService;
  protected overrideOptions = this.defaultPagingOptions;

  protected columns = [
    new Column(COLUMNS.LABEL("Nom", "lastName", 80), EDITABLE_TYPES.textInput),
    new Column(COLUMNS.LABEL("Prénom", "firstName", 80), EDITABLE_TYPES.textInput),
    new Column(COLUMNS.LABEL("Email", "email", 150), EDITABLE_TYPES.textInput),
    new Column({
      title: "Formation", data: "formation", width: "70px", render: (formation) => {
        return (formation !== null) ? formation.label : "";
      },
    }, EDITABLE_TYPES.select, {
      options$: Api.formationService.list(),
      emptyLabel: "-- formation --",
    }),
    new Column(COLUMNS.EDIT),
    new Column(COLUMNS.DELETE),
  ];

  public editAction = (trainee: Trainee) => {
    this.$router.push("/students/" + trainee.identifier);
  };
}

export default TraineeList;
