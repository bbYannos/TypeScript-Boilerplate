import {AbstractApiModel} from "shared/abstract-api";
import {JsonObject, JsonProperty} from "shared/json2typescript";

@JsonObject("ExamType")
export class ExamType extends AbstractApiModel {
  public constructorName: string = "ExamType";

  @JsonProperty("label", String, true)
  public label: string = "";

  @JsonProperty("coefficient", Number)
  public coefficient: number = null;
}
