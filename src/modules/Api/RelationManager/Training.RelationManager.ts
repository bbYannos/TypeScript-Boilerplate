import {
  AbstractRelationManager,
  ChildrenListDefinition,
  OneToOneRelation,
  OneToParentRelation,
  PeriodList,
} from "shared/abstract-api";
import {
  Formation,
  formationService,
  Module,
  moduleService,
  Speaker,
  speakerService,
  Training,
  trainingService,
} from "../Service";
import {formationRelationManager} from "./Formation.RelationManager";
import {speakerRelationManager} from "./Speaker.RelationManager";

const formationRelation =  new OneToParentRelation<Training, Formation>("formation", "trainings$", formationService);


formationRelationManager.childrenListDefinitions.push({
  propertyName: "trainings$",
  defaultSource$: (object) => trainingService.getByFormation(object),
  jsonKey: "trainings",
  service: trainingService,
  listConstructor: PeriodList,
  // debug: true
} as ChildrenListDefinition<Formation, Training>);

const speakerRelation =  new OneToParentRelation<Training, Speaker>("speaker", "trainings$", speakerService);
speakerRelationManager.childrenListDefinitions.push({
  propertyName: "trainings$",
  defaultSource$: (object) => trainingService.getBySpeaker(object),
  jsonKey: "trainings",
  service: trainingService,
  listConstructor: PeriodList,
} as ChildrenListDefinition<Speaker, Training>);

const moduleRelation = new OneToOneRelation<Training, Module>("module", moduleService);

formationRelation.debug = false;
moduleRelation.debug = false;
speakerRelation.debug = false;

export class TrainingRelationManager extends AbstractRelationManager<Training> {
  protected service = trainingService;
  protected oneToOneRelations = [
    moduleRelation,
    formationRelation,
    speakerRelation,
  ];
}

export const trainingRelationManager = new TrainingRelationManager();
trainingRelationManager.init();
trainingRelationManager.debug = false;
