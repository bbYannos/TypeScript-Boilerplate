import {ChildrenListDefinition, PeriodList, RelationManager} from "shared/abstract-api";
import {Formation, formationService} from "../Formation";
import {Speaker, speakerService} from "../Speaker";
import {Availability, AvailabilityService} from "./Availability.Service";
import {AvailabilityToParentRelation} from "./AvailabilityToParent.Relation";

const availabilityService = RelationManager.makeService(AvailabilityService, [
  new AvailabilityToParentRelation(),
]);

formationService.repository.relationManager.childrenListDefinitions.push({
  propertyName: "allAvailabilities$",
  defaultSource$: (object) => availabilityService.getByFormation(object),
  jsonKey: "availabilities",
  service: availabilityService,
  listConstructor: PeriodList,
} as ChildrenListDefinition<Formation, Availability>);

speakerService.repository.relationManager.childrenListDefinitions.push({
  propertyName: "allAvailabilities$",
  defaultSource$: (object) => availabilityService.getBySpeaker(object),
  jsonKey: "availabilities",
  service: availabilityService,
  listConstructor: PeriodList,
} as ChildrenListDefinition<Speaker, Availability>);

export {Availability, AvailabilityService, availabilityService};
