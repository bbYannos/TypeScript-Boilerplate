import {combineLatest} from "rxjs";
import {auditTime, map, shareReplay} from "rxjs/operators";
import {ChildrenListDefinition, PeriodList, RelationManager} from "shared/abstract-api";
import {Formation, formationService} from "../Formation";
import {Speaker, speakerService} from "../Speaker";
import {Availability, AvailabilityService} from "./Availability.Service";
import {AvailabilityToParentRelation} from "./AvailabilityToParent.Relation";

const parentRelation = new AvailabilityToParentRelation();
const availabilityService = RelationManager.makeService(AvailabilityService, [
  parentRelation,
]);

formationService.repository.relationManager.childrenListDefinitions.push({
  propertyName: "allAvailabilities$",
  defaultSource$: (object) => availabilityService.getByFormation(object),
  jsonKey: "availabilities",
  service: availabilityService,
  listConstructor: PeriodList,
} as ChildrenListDefinition<Formation, Availability>);

/**
 * Return combine Formation.vacations$ end globalVacations$
 * WRAPPED IN A FUNCTION TO AVOID DIRECT CALL ON CONSTRUCTION
 */
formationService.repository.relationManager.finalizeFunctions.push(
  (formation) => {
    formation.allVacations$ = combineLatest([formation.vacations$, availabilityService.globalVacations$]).pipe(
      auditTime(10),
      map((vacationsArray: Availability[][]) => vacationsArray.flat()),
      shareReplay(1),
    );
  },
);

speakerService.repository.relationManager.childrenListDefinitions.push({
  propertyName: "allAvailabilities$",
  defaultSource$: (object) => availabilityService.getBySpeaker(object),
  jsonKey: "availabilities",
  service: availabilityService,
  listConstructor: PeriodList,
} as ChildrenListDefinition<Speaker, Availability>);

export {Availability, AvailabilityService, availabilityService};
