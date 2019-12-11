import {Observable} from "rxjs";
import {AbstractApiModel} from "shared/abstract-api";
import {JsonObject, JsonProperty, RelationConverter} from "shared/json2typescript";
import {Formation} from "../Formation/Formation.Model";
import {Training} from "../Training/Training.Model";

@JsonObject("Module")
export class Module extends AbstractApiModel {
  public constructorName: string = "Module";

  @JsonProperty("label", String, true)
  public label: string = "";

  @JsonProperty("coefficient", Number)
  public coefficient: number = 1;

  @JsonProperty("formation", RelationConverter)
  public formation: Formation = null;

  @JsonProperty("color", String, true)
  public color: string = "#881C25";

  public trainings$: Observable<Training[]> = null;
}
