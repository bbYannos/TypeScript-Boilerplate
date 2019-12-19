import {ListComponent} from "components/lists/list.component";
import Api from "modules/Api/Api.module";
import {Formation} from "modules/Api/Model/Formation";
import {Training, TrainingQuery} from "modules/Api/Model/Training/Training.Service";
import {COLUMNS, EDITABLE_TYPES} from "modules/DataTable/Constants";
import {Column} from "modules/DataTable/models/Column";
import {takeUntil} from "rxjs/operators";
import {Store} from "./_store";

// noinspection JSUnusedGlobalSymbols
export class TrainingList extends ListComponent<Training> {
  public data: {
    addButtonDisplayed: boolean,
  } = {
    addButtonDisplayed: true,
  };

  protected formation: Formation = null;
  protected service = Api.trainingService;

  protected getColumns() {
    return [
      new Column(COLUMNS.LABEL("Intitulé", "label"), EDITABLE_TYPES.textInput),
      new Column({
        title: "Intervenant", data: "speaker", render: (speaker) => {
          return (speaker !== null) ? speaker.label : "";
        },
      }, EDITABLE_TYPES.select, {
        options$: Api.speakerService.fetchAll$,
        emptyLabel: "-- intervenant --",
      }),
      new Column({
        title: "Module", data: "module", render: (module) => {
          return (module !== null) ? module.label : "";
        },
      }, EDITABLE_TYPES.select, {
        options$: this.formation.modules$,
        emptyLabel: "-- module --",
      }),
      new Column(COLUMNS.TIME("Durée", "duration"), EDITABLE_TYPES.durationInput),
      new Column(COLUMNS.COLOR("color"), EDITABLE_TYPES.colorPicker),
      new Column(COLUMNS.DELETE),
    ];
  }

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

export default TrainingList;
