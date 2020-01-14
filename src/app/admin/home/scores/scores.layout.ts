import {CardPlugin} from "bootstrap-vue";
import Api from "modules/Api/Api.module";
import {Exam} from "modules/Api/Model/Exam";
import {Formation} from "modules/Api/Model/Formation";
import {Speaker} from "modules/Api/Model/Speaker";
import {Training, TrainingQuery} from "modules/Api/Model/Training/Training.Service";
import {LabeledInterface} from "shared/abstract-api/classes/models";
import {Component, Vue, VueComponent} from "shared/vue";
import WithRender from "./scores.layout.html";
import {SpateList} from "./spate.list";

Vue.use(CardPlugin);

@WithRender
@Component({components: {SpateList}})
export class ScoresLayout extends Vue implements VueComponent {
  public $refs: {spateList: SpateList} = {spateList: null};

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
        this.$refs.spateList.setSource$(Api.trainingService.list(trainingQuery));
        break;
      case "Training":
        this.data = {formation: this.data.formation, speaker: this.data.speaker, training: object as Training};
        this.$refs.spateList.setSource$(this.data.training.exams$);
    }
  }
}
