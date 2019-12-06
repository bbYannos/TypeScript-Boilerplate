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
import {Trainee} from "./Trainee.Model";

@JsonObject("Absence")
export class Absence extends AbstractPeriod {

  public set delay(delay: boolean) {
    this._delay = delay;
    this.duration = this._delay ? moment.duration(0) : moment.duration(3, "hour");
  }

  public get delay() {
    return this._delay;
  }
  public constructorName: string = "Absence";

  @JsonProperty("startTime", MomentConverter, true)
  public startTime: moment.Moment = moment().startOf("day").add(9, "hour");

  @JsonProperty("duration", DurationConverter, true)
  public duration: moment.Duration = moment.duration(3, "hour");

  @JsonProperty("justified", BooleanConverter, true)
  public justified: boolean = false;

  @JsonProperty("justification", String, true)
  public justification: string = "";

  @JsonProperty("trainee", RelationConverter, true)
  public trainee: Trainee = null;

  @JsonProperty("delay", BooleanConverter, true)
  protected _delay: boolean = false;
}
