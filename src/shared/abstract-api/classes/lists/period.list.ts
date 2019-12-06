import * as moment from "moment";
import {AbstractPeriod} from "../models";
import {ObjectList} from "./object.list";

export class PeriodList<T extends AbstractPeriod> extends ObjectList<T> {
  protected _durationCache: moment.Duration = null;

  public get duration() {
    if (this._durationCache === null) {
      this._durationCache = moment.duration();
      this._objects.forEach((object) => {
        this._durationCache.add(object.duration);
      });
    }
    return this._durationCache;
  }

  public deleteDurationCache() {
    this._durationCache = null;
  }

  public push(object: T, emit: boolean = true) {
    // this.log("PeriodList Push asked");
    const response = super.push(object, false);
    if (response) {
      // this.log("PeriodList Push done");
      this.deleteDurationCache();
      // console.log("Duration updated", this.duration.format("HH:mm"));
      if (emit) {
        // this.log("PeriodList Emit change", this._objects);
        this.emitChange();
      }
    }
    return response;
  }

  public delete(object: T, emit: boolean = true): boolean {
    this.log("Delete asked");
    const response = super.delete(object);
    if (response) {
      this.log("Delete done");
      this.deleteDurationCache();
      if (emit) {
        this.log("Emit change", this._objects);
        this.emitChange();
      }
    }
    return response;
  }
}
