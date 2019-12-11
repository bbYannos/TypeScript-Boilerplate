import {ChildrenListDefinition, PeriodList, PeriodToParentRelation, RelationManager} from "shared/abstract-api";
import {Training, trainingService} from "../Training";
import {Session, SessionService} from "./Session.Service";

const sessionService = RelationManager.makeService(SessionService, [
  new PeriodToParentRelation<Session, Training>("training", "sessions$", trainingService),
]);

trainingService.repository.relationManager.childrenListDefinitions.push({
  propertyName: "sessions$",
  defaultSource$: (object) => sessionService.getByTraining(object),
  jsonKey: "sessions",
  service: sessionService,
  listConstructor: PeriodList,
} as ChildrenListDefinition<Training, Session>);

export {Session, SessionService, sessionService};
