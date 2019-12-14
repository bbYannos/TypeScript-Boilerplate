import {combineLatest} from "rxjs";
import {auditTime, map, shareReplay, tap} from "rxjs/operators";
import {ChildrenListDefinition, PeriodList, RelationManager} from "shared/abstract-api";
import moment from "../../../../shared/moment";
import {FormationUtil} from "../../Util/Formation.Util";
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

/**
 * Return combine Formation.vacations$ end globalVacations$
 * WRAPPED IN A FUNCTION TO AVOID DIRECT CALL ON CONSTRUCTION

formationService.repository.relationManager.childrenListDefinitions.push({
  propertyName: "allVacations$",
  defaultSource$: (object: Formation) => {
    return combineLatest([
      availabilityService.globalVacations$.pipe(
        tap((res) =>  this.log("globalVacations$", res.length)),
      ),
      object.vacations$.pipe(
        tap((res) =>  this.log("vacations$", res.length)),
      ),
    ]).pipe(
      auditTime(10),
      map((vacationsArray: Availability[][]) => vacationsArray.flat()),
      tap((res: Availability[]) => {
        res.forEach((re) => this.log(re.open, re.global));
      }),
      shareReplay(1),
    );
  },
  service: availabilityService,
} as ChildrenListDefinition<Formation, Availability>);

 */
speakerService.repository.relationManager.childrenListDefinitions.push({
  propertyName: "allAvailabilities$",
  defaultSource$: (object) => availabilityService.getBySpeaker(object),
  jsonKey: "availabilities",
  service: availabilityService,
  listConstructor: PeriodList,
} as ChildrenListDefinition<Speaker, Availability>);

export {Availability, AvailabilityService, availabilityService};
