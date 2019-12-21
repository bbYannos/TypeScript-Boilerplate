import {PeriodList} from "../lists";
import {AbstractApiModel, AbstractPeriod} from "../models";
import {OneToGenericParentRelation} from "./one-to-genericParent.relation";


export interface PeriodWithGenericParent extends AbstractPeriod {
  parent: AbstractApiModel;
  parentClass: string;
}

export class PeriodToGenericParentRelation<T extends PeriodWithGenericParent, U extends AbstractApiModel> extends OneToGenericParentRelation<T, U> {
  public updateParent(object: T) {
    if (this.getParent(object))  {
      this.log(this.getParent(object));
      this.getParentList<PeriodList<T>>(object).deleteDurationCache();
      this.getParentList(object).emitChange();
    }
  }

  public listenObject(object: T) {
    super.listenObject(object);
    this.listen(object, "duration", (_object) => this.updateParent(_object));
    this.listen(object, "startTime", (_object) => this.updateParent(_object));
  }

  public unListenObject(object: T) {
    super.unListenObject(object);
    this.unListen(object, "duration");
    this.unListen(object, "startTime");
  }
}
