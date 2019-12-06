import * as moment from "moment";
import {DurationConverter, JsonObject, JsonProperty, MomentConverter} from "shared/json2typescript";
import {PeriodInterface} from "./period.model";
import {AbstractSortable} from "./sortable.model";

@JsonObject("AbstractSortablePeriod")
export abstract class AbstractSortablePeriod extends AbstractSortable implements PeriodInterface {
  @JsonProperty("startTime", MomentConverter, true)
  public startTime: moment.Moment = null;

  @JsonProperty("duration", DurationConverter, true)
  public duration: moment.Duration = moment.duration(0);

  public endTime: moment.Moment;
  public moveStartTime: (qty: number, unit: moment.unitOfTime.Diff) => void;
  public moveEndTime: (_number: number, unit: moment.unitOfTime.Diff) => void;
}
