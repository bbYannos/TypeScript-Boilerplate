import {CardPlugin, TabsPlugin} from "bootstrap-vue";
import Api from "modules/Api/Api.module";
import {TraineeQuery} from "modules/Api/Model/Trainee/Trainee.Service";
import {from, Subject} from "rxjs";
import {Component, Vue} from "shared/vue";
import {Absence} from "../../../../../modules/Api/Model/Absence";
import WithRender from "./absences.layout.html";

Vue.use(TabsPlugin);
Vue.use(CardPlugin);

@WithRender
@Component
export class AbsencesLayout extends Vue {
  public absenceList$ = () =>  from(import(/* webpackChunkName: "admin" */ "./absence.list"));
  public addAbsence_: Subject<Absence> = new Subject<Absence>();
  public traineeAutocompleteSource$ = (searchedString) => {
    const traineeQuery = new TraineeQuery();
    traineeQuery.searchedString = searchedString;
    return Api.traineeService.list(traineeQuery);
  };
}
