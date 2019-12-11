import {AbstractRepositoryService, PeriodToGenericParentRelation} from "shared/abstract-api";
import {Formation, formationService} from "../Formation";
import {Speaker, speakerService} from "../Speaker";
import {Availability} from "./Availability.Model";

export class AvailabilityToParentRelation extends PeriodToGenericParentRelation<Availability, Formation | Speaker> {
  constructor() {
    super("allAvailabilities$");
  }

  public getServiceForForeign(object: Availability): AbstractRepositoryService<any> {
    if (object.parentClass === "Formation") {
      return formationService;
    } else {
      return speakerService;
    }
  }

  public listenObject(object: Availability) {
    super.listenObject(object);
    this.listen(object, "global", this.updateParent);
  }

  public unListen(object: Availability, property: keyof Availability) {
    super.unListen(object, property);
    super.unListen(object, "global");
  }
}
