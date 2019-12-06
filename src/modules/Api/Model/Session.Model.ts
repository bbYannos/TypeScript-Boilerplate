import {AbstractPeriod} from "shared/abstract-api";
import {JsonObject, JsonProperty, RelationConverter} from "shared/json2typescript";
import {Training} from "./Training.Model";

@JsonObject("Session")
export class Session extends AbstractPeriod {
  public constructorName: string = "Session";
  @JsonProperty("training", RelationConverter, true)
  public training: Training = null;

  get label() {
    if (this.training === null) {
      return "";
    }
    return this.training.label;
  }

  public get color(): string {
    return this.training.color;
  }

  public set color(color: string) {
  }
}
