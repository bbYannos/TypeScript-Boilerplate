import * as moment from "moment";
import {DurationConverter, JsonObject, JsonProperty, MomentConverter} from "shared/json2typescript";
import {ObjectUtils} from "shared/utils/object.utils";
import {AbstractApiModel} from "./api.model";

export interface PeriodInterface {
  endTime: moment.Moment;
  moveStartTime: (qty: number, unit: moment.unitOfTime.Diff) => void;
  moveEndTime: (_number: number, unit: moment.unitOfTime.Diff) => void;
}

@JsonObject("AbstractPeriod")
export abstract class AbstractPeriod extends AbstractApiModel {
  @JsonProperty("startTime", MomentConverter, true)
  public startTime: moment.Moment = null;

  @JsonProperty("duration", DurationConverter, true)
  public duration: moment.Duration = moment.duration(0);

  public get endTime(): moment.Moment {
    if (ObjectUtils.isValidMoment(this.startTime) && moment.isDuration(this.duration)) {
      return this.startTime.clone().add(this.duration.asMilliseconds());
    }
    return null;
  }

  public set endTime(time: moment.Moment) {
    if (ObjectUtils.isValidMoment(time)) {
      if (ObjectUtils.isValidMoment(this.startTime)) {
        this.duration = moment.duration(time.diff(this.startTime));
      } else {
        this.startTime = time;
        this.duration = moment.duration(0);
      }
    } else {
      this.duration = moment.duration(0);
    }
  }

  public moveStartTime(qty: number, unit: moment.unitOfTime.Diff = "millisecond") {
    const currentEndTime = this.endTime;
    if (this.startTime !== null) {
      this.startTime.add(qty, unit);
      this.endTime = currentEndTime;
    }
  }

  public moveEndTime(_number: number, unit: moment.unitOfTime.Diff = "millisecond") {
    if (this.endTime !== null) {
      this.endTime = this.endTime.add(_number, unit);
    }
  }
}
