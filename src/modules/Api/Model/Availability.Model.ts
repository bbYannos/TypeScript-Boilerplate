import {AbstractPeriod} from "shared/abstract-api";
import {
  BooleanConverter,
  DurationConverter,
  JsonObject,
  JsonProperty,
  MomentConverter,
  RelationConverter,
} from "shared/json2typescript";
import moment from "shared/moment/moment";
import {Formation} from "./Formation.Model";
import {Speaker} from "./Speaker.Model";

@JsonObject("Availability")
export class Availability extends AbstractPeriod {
  public constructorName: string = "Availability";
  @JsonProperty("label", String)
  public label: string = "";
  @JsonProperty("open", BooleanConverter)
  public open: boolean = true;
  @JsonProperty("global", BooleanConverter, true)
  public global: boolean = false;
  @JsonProperty("parent", RelationConverter, true)
  public parent: Formation | Speaker = null;
  @JsonProperty("parentClass", String, true)
  public parentClass: string = null;

  @JsonProperty("startTime", MomentConverter, true)
  public startTime: moment.Moment = null;

  @JsonProperty("duration", DurationConverter, true)
  public duration: moment.Duration = moment.duration(0);

}
