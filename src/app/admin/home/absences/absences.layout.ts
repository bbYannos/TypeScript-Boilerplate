import InputClearable from "components/forms/input-clearable";
import Api from "modules/Api/Api.module";
import {Absence} from "modules/Api/Model/Absence";
import {TraineeQuery} from "modules/Api/Model/Trainee/Trainee.Service";
import {from, Subject} from "rxjs";
import {Component, Vue, VueComponent} from "shared/vue";
import WithRender from "./absences.layout.html";

@WithRender
@Component({components: {InputClearable}})
export class AbsencesLayout extends Vue implements VueComponent {
  public delayList$ = () =>  from(import(/* webpackChunkName: "admin" */ "./delay.list"));
  public absenceList$ = () =>  from(import(/* webpackChunkName: "admin" */ "./absence.list"));
  public synthesisList$ = () =>  from(import(/* webpackChunkName: "admin" */ "./synthesis.list"));
  public traineeAutocompleteSource$ = (searchedString) => {
    const traineeQuery = new TraineeQuery();
    traineeQuery.searchedString = searchedString;
    return Api.traineeService.list(traineeQuery);
  };
  public addDelay_: Subject<Absence> = new Subject<Absence>();
}
