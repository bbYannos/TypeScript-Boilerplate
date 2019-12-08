import {
  AbstractRelationManager,
  ChildrenListDefinition,
  PeriodList,
  PeriodToParentRelation,
  ServiceFactory,
} from "shared/abstract-api";
import {Session} from "../Model/Session.Model";
import {Training} from "../Model/Training.Model";
import {SessionService} from "../Service/Session.Service";
import {TrainingService} from "../Service/Training.Service";
import {trainingRelationManager} from "./Training.RelationManager";

const sessionService = ServiceFactory.getService(SessionService);
const trainingRelation = new PeriodToParentRelation<Session, Training>("training", "sessions$", TrainingService);
trainingRelationManager.childrenListDefinitions.push({
  propertyName: "sessions$",
  defaultSource$: (object) => sessionService.getByTraining(object),
  jsonKey: "sessions",
  service: sessionService,
  listConstructor: PeriodList,
} as ChildrenListDefinition<Training, Session>);

export class SessionRelationManager extends AbstractRelationManager<Session> {
  protected Service = SessionService;
  protected oneToOneRelations = [trainingRelation];
}

export const sessionRelationManager = new SessionRelationManager();
sessionRelationManager.init();
sessionRelationManager.debug = false;
