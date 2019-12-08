import {
  AbstractRelationManager,
  ChildrenListDefinition,
  OneToOneRelation,
  OneToParentRelation,
  PeriodList, ServiceFactory,
} from "shared/abstract-api";
import {Formation} from "../Model/Formation.Model";
import {Module} from "../Model/Module.Model";
import {Speaker} from "../Model/Speaker.Model";
import {Training} from "../Model/Training.Model";
import {FormationService} from "../Service/Formation.Service";
import {ModuleService} from "../Service/Module.Service";
import {SpeakerService} from "../Service/Speaker.Service";
import {TrainingService} from "../Service/Training.Service";

import {formationRelationManager} from "./Formation.RelationManager";
import {speakerRelationManager} from "./Speaker.RelationManager";

const formationRelation =  new OneToParentRelation<Training, Formation>("formation", "trainings$", ServiceFactory.getService(FormationService));

const trainingService = ServiceFactory.getService(TrainingService);
formationRelationManager.childrenListDefinitions.push({
  propertyName: "trainings$",
  defaultSource$: (object) => trainingService.getByFormation(object),
  jsonKey: "trainings",
  service: trainingService,
  listConstructor: PeriodList,
  // debug: true
} as ChildrenListDefinition<Formation, Training>);

const speakerRelation =  new OneToParentRelation<Training, Speaker>("speaker", "trainings$", ServiceFactory.getService(SpeakerService));
speakerRelationManager.childrenListDefinitions.push({
  propertyName: "trainings$",
  defaultSource$: (object) => trainingService.getBySpeaker(object),
  jsonKey: "trainings",
  service: trainingService,
  listConstructor: PeriodList,
} as ChildrenListDefinition<Speaker, Training>);

const moduleRelation = new OneToOneRelation<Training, Module>("module", ServiceFactory.getService(ModuleService));

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
