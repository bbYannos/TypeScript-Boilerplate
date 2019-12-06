import {AbstractRelationManager, ChildrenListDefinition, PeriodList, PeriodToParentRelation} from "shared/abstract-api";
import {Session, sessionService, Training, trainingService} from "../Service";
import {trainingRelationManager} from "./Training.RelationManager";

const trainingRelation = new PeriodToParentRelation<Session, Training>("training", "sessions$", trainingService);
trainingRelationManager.childrenListDefinitions.push({
  propertyName: "sessions$",
  defaultSource$: (object) => sessionService.getByTraining(object),
  jsonKey: "sessions",
  service: sessionService,
  listConstructor: PeriodList,
} as ChildrenListDefinition<Training, Session>);

export class SessionRelationManager extends AbstractRelationManager<Session> {
  protected service = sessionService;
  protected oneToOneRelations = [trainingRelation];
}

export const sessionRelationManager = new SessionRelationManager();
sessionRelationManager.init();
sessionRelationManager.debug = false;
