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

const trainingService = RelationManager.makeService(TrainingService, [
  new OneToParentRelation<Training, Formation>("formation", "trainings$", formationService),
  new OneToParentRelation<Training, Speaker>("speaker", "trainings$", speakerService),
  new OneToOneRelation<Training, Module>("module", moduleService),
]);

formationService.repository.relationManager.childrenListDefinitions.push({
  propertyName: "trainings$",
  defaultSource$: (object) => trainingService.getByFormation(object),
  jsonKey: "trainings",
  service: trainingService,
  listConstructor: PeriodList,
  // debug: true
} as ChildrenListDefinition<Formation, Training>);

speakerService.repository.relationManager.childrenListDefinitions.push({
  propertyName: "trainings$",
  defaultSource$: (object) => trainingService.getBySpeaker(object),
  jsonKey: "trainings",
  service: trainingService,
  listConstructor: PeriodList,
} as ChildrenListDefinition<Speaker, Training>);

export {Training, TrainingService, trainingService};

/*
formationRelation.debug = false;
moduleRelation.debug = false;
speakerRelation.debug = false;
*/


