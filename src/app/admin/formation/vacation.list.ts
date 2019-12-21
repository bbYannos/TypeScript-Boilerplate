import {ListComponent} from "components/lists/list.component";
import Api from "modules/Api/Api.module";
import {Formation} from "modules/Api/Model/Formation";
import {COLUMNS, DATE_FORMAT, EDITABLE_TYPES} from "modules/DataTable/Constants";
import {Column} from "modules/DataTable/models/Column";
import {Availability} from "modules/Api/Model/Availability";
import {takeUntil} from "rxjs/operators";
import {TrainingQuery} from "../../../modules/Api/Model/Training/Training.Service";
import {Store} from "./_store";
import FormationList from "./formation.list";

export class VacationList extends ListComponent<Availability> {
  public data = {
    addButtonDisplayed: true,
  };
  protected service = Api.availabilityService;
  protected columns = [
    new Column(COLUMNS.LABEL("Titre", "label"), EDITABLE_TYPES.textInput),
    new Column(COLUMNS.DATE_TIME("Deb.", "startTime", DATE_FORMAT), EDITABLE_TYPES.dateInput),
    new Column(COLUMNS.DATE_TIME("Fin", "endTime", DATE_FORMAT), EDITABLE_TYPES.dateInput),
    new Column({
      title: "Global ?",
      data: "global",
      render: (data) => IconsService.onOff(data),
      width: "40px",
      className: "align-center",
    }, null),
    new Column(COLUMNS.DELETE),
  ];

  public render() {
    Store.formation_.pipe(takeUntil(this.close$)).subscribe((formation: Formation) => {
      this.formation = formation;
      this.columns = this.getColumns();
      const query = new TrainingQuery();
      query.formation = formation;
      this.dataSource$ = formation.trainings$;
      this.createAction = () => Api.trainingService.createByQuery(query);
      super.render();
    });
  }
}

export default FormationList;
