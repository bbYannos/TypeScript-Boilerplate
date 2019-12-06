import {
  AbstractRelationManager,
  AbstractRepositoryService,
  ChildrenListDefinition,
  PeriodList,
  PeriodToGenericParentRelation,
} from "shared/abstract-api";

import {Availability, availabilityService, Formation, formationService, Speaker, speakerService} from "../Service";
import {formationRelationManager} from "./Formation.RelationManager";
import {speakerRelationManager} from "./Speaker.RelationManager";

class AvailabilityToParentRelation extends PeriodToGenericParentRelation<Availability, Formation | Speaker> {
  constructor() {
    super("allAvailabilities$");
  }
  public getServiceForForeign = (object: Availability): AbstractRepositoryService<Formation | Speaker> => {
    if (object.parentClass === "Formation") {
      return formationService;
    } else {
      return speakerService;
    }
  };

  public listenObject = (object: Availability) => {
    super.listenObject(object);
    this.listen(object, "global", this.updateParent);
  };

  public unListen = (object: Availability, property: keyof Availability) => {
    super.unListen(object, property);
    super.unListen(object, "global");
  }
}
const parentRelation = new AvailabilityToParentRelation();
formationRelationManager.childrenListDefinitions.push({
  propertyName: "allAvailabilities$",
  defaultSource$: (object) => availabilityService.getByFormation(object),
  jsonKey: "availabilities",
  service: availabilityService,
  listConstructor: PeriodList,
} as ChildrenListDefinition<Formation, Availability>);

speakerRelationManager.childrenListDefinitions.push({
  propertyName: "allAvailabilities$",
  defaultSource$: (object) => availabilityService.getBySpeaker(object),
  jsonKey: "availabilities",
  service: availabilityService,
  listConstructor: PeriodList,
} as ChildrenListDefinition<Speaker, Availability>);

// tslint:disable-next-line:max-classes-per-file
export class AvailabilityRelationManager extends AbstractRelationManager<Availability> {
  protected service = availabilityService;
  protected oneToOneRelations = [parentRelation];
}
export const availabilityRelationManager = new AvailabilityRelationManager();
availabilityRelationManager.init();

