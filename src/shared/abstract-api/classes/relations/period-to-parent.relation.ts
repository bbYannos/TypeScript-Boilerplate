import {PeriodList} from "../lists";
import {AbstractApiModel, AbstractPeriod} from "../models";
import {OneToParentRelation} from "./one-to-parent.relation";

export class PeriodToParentRelation<T extends AbstractPeriod, U extends AbstractApiModel> extends OneToParentRelation<T, U> {
  public updateParent = (object: T) => {
    if (this.getParent(object)) {
      this.getParentList<PeriodList<T>>(object).deleteDurationCache();
      this.getParentList(object).emitChange();
    }
  };

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
