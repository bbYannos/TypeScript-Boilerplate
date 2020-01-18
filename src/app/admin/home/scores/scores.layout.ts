import {CardPlugin} from "bootstrap-vue";
import {SpateList} from "components/spate-list/spate.list";
import Api from "modules/Api/Api.module";
import {Exam} from "modules/Api/Model/Exam";
import {Formation} from "modules/Api/Model/Formation";
import {Speaker} from "modules/Api/Model/Speaker";
import {Training, TrainingQuery} from "modules/Api/Model/Training/Training.Service";
import {from} from "rxjs";
import {LabeledInterface} from "shared/abstract-api/classes/models";
import {Component, Vue, VueComponent} from "shared/vue";
import {ExamExamTypeTabs} from "./exam-exam-type/exam-exam-type.tabs";
import WithRender from "./scores.layout.html";

import "@AppL"

Vue.use(CardPlugin);

@WithRender
@Component({components: {SpateList, ExamModuleTabs: ExamExamTypeTabs}})
export class ScoresLayout extends Vue implements VueComponent {
  public $refs: {spateList: SpateList} = {spateList: null};
  public examScoreList$ = () =>  from(import(/* webpackChunkName: "admin" */ "app/_common/lists/exam-score.list"));

  public data: {
    formation?: Formation,
    speaker?: Speaker,
    training?: Training,
    exam?: Exam,
  } = {};

  public mounted(): void {
    this.$refs.spateList.getLabel = this.getLabel;
    this.select(null);
  }

  public getLabel = (object: LabeledInterface) => {
    switch (object.constructorName) {
      case "Speaker":
        const speaker = object as Speaker;
        return speaker.lastName + " " + speaker.firstName;
      case "Training":
        const training = object as Training;
        return ((training.module) ? training.module.label : "Pas de module") + " - " + training.label;
      default:
        return object.label;
    }
  };

  public select(object: LabeledInterface) {
    if (object === null) {
      this.data = {};
      this.$refs.spateList.setSource$(Api.formationService.fetchAll$);
      return;
    }
    switch (object.constructorName) {
      case "Formation":
        this.data = {formation: object as Formation};
        this.$refs.spateList.setSource$(Api.speakerService.getByFormation(this.data.formation, true));
        break;
      case "Speaker":
        this.data = {formation: this.data.formation, speaker: object as Speaker};
        const trainingQuery = new TrainingQuery();
        trainingQuery.formation = this.data.formation;
        trainingQuery.speaker = this.data.speaker;
        trainingQuery.canHaveExams = true;
        this.$refs.spateList.setSource$(Api.trainingService.list(trainingQuery));
        break;
      case "Training":
        this.data = {
          formation: this.data.formation,
          speaker: this.data.speaker,
          training: object as Training,
        };
        break;
      case "Exam":
        this.data = {
          formation: this.data.formation,
          speaker: this.data.speaker,
          training: this.data.training,
          exam: object as Exam,
        };
        break;
    }
  }
}
