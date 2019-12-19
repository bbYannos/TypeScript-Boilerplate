import {
  ChildrenListDefinition,
  OneToOneRelation,
  OneToParentRelation,
  PeriodList,
  RelationManager,
} from "shared/abstract-api";
import {Formation, formationService} from "../Formation/";
import {Module, moduleService} from "../Module";
import {Speaker, speakerService} from "../Speaker/";
import {Training, TrainingService} from "./Training.Service";

const trainingRelation =  new OneToParentRelation<Training, Speaker>("speaker", "trainings$", speakerService);
const trainingService = RelationManager.makeService(TrainingService, [
  new OneToParentRelation<Training, Formation>("formation", "trainings$", formationService),
  trainingRelation,
  new OneToOneRelation<Training, Module>("module", moduleService),
]);

formationService.repository.relationManager.childrenListDefinitions.push({
  propertyName: "trainings$",
  defaultSource$: (object) => trainingService.getByFormation(object),
  jsonKey: "trainings",
  service: trainingService,
  listConstructor: PeriodList,
} as ChildrenListDefinition<Formation, Training>);

speakerService.repository.relationManager.childrenListDefinitions.push({
  propertyName: "trainings$",
  defaultSource$: (object) => trainingService.getBySpeaker(object),
  jsonKey: "trainings",
  service: trainingService,
  listConstructor: PeriodList,
} as ChildrenListDefinition<Speaker, Training>);

export {Training, TrainingService, trainingService};


