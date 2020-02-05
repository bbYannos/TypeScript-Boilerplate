import {ListComponent} from "components/lists/list.component";
import Api from "modules/Api/Api.module";
import {Formation} from "modules/Api/Model/Formation";
import {Speaker} from "modules/Api/Model/Speaker";
import {Training, TrainingQuery} from "modules/Api/Model/Training/Training.Service";
import {COLUMNS, EDITABLE_TYPES} from "modules/DataTable/Constants";
import {Column} from "modules/DataTable/models/Column";
import {switchMap, tap} from "rxjs/operators";
import {Store} from "../../_store";

export class TrainingList extends ListComponent<Training> {
  public data: {
    addButtonDisplayed: boolean,
  } = {
    addButtonDisplayed: true,
  };

  protected service = Api.trainingService;
  protected query = new TrainingQuery();
  protected silentProperties = ["label", "formation", "duration"];

  protected columns = [
    new Column(COLUMNS.LABEL("Intitulé", "label"), EDITABLE_TYPES.textInput),
    new Column({
      title: "Formation", data: "formation", render: (formation) => {
        return (formation !== null) ? formation.label : "";
      },
    }, EDITABLE_TYPES.select, {
      options$: Api.formationService.fetchAll$,
      emptyLabel: "-- formation --",
    }),
    new Column(COLUMNS.TIME("Durée", "duration"), EDITABLE_TYPES.durationInput),
    new Column(COLUMNS.COLOR("color"), EDITABLE_TYPES.colorPicker),
    new Column(COLUMNS.DELETE),
  ];

  public render() {
    this.dataSource$ = Store.speaker_.pipe(
      tap((speaker: Speaker) => {
        // avoid highlight of all rows
        if (this._dataTable) {
          this._dataTable.currentObjects = null;
        }
        this.loading_.next(true);
        this.query.speaker = speaker;
      }),
      switchMap((speaker) => speaker.trainings$),
    );
    this.createAction = () => Api.trainingService.createByQuery(this.query);
    super.render();
  }
}

export default TrainingList;
