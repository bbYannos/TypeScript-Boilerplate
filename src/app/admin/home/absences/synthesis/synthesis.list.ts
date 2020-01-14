import {ListComponent} from "components/lists/list.component";
import Api from "modules/Api/Api.module";
import {Trainee} from "modules/Api/Model/Trainee";
import {COLUMNS} from "modules/DataTable/Constants";
import {Column} from "modules/DataTable/models/Column";
import {UNJUSTIFIED_ABSENCES} from "../absences/absence.list";
import {DELAY_TOTAL} from "../delays/delay.list";

export class SynthesisList extends ListComponent<Trainee> {
  protected overrideOptions = this.defaultPagingOptions;
  protected service = Api.traineeService;
  protected columns = [
    new Column(COLUMNS.MAILTO_LINK("Nom", "label", "email")),
    new Column(COLUMNS.LABEL("Formation", "formation.label")),
    new Column(COLUMNS.NUMBER("Abs. total", "absences.length")),
    new Column({...UNJUSTIFIED_ABSENCES, ...{data: "unjustifiedAbsences.length"}}),
    new Column({...DELAY_TOTAL, ...{data: null}}),
    new Column(COLUMNS.EDIT),
  ];

  public editAction = (trainee: Trainee) => {
    this.$router.push("/students/" + trainee.identifier + "/absences");
  };
}

export default SynthesisList;
