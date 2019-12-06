import {AbstractApiModel} from "shared/abstract-api";
import {JsonObject, JsonProperty, MomentConverter, RelationConverter} from "shared/json2typescript";
import moment from "shared/moment/moment";
import {Training} from "..";
import {ExamType} from "./ExamType.Model";

@JsonObject("Exam")
export class Exam extends AbstractApiModel {
  public constructorName: string = "Exam";

  @JsonProperty("label", String, true)
  public label: string = "";

  @JsonProperty("dateTime", MomentConverter)
  public dateTime: moment.Moment = moment();

  @JsonProperty("training", RelationConverter, true)
  public training: Training = null;

  @JsonProperty("examType", RelationConverter, true)
  public examType: ExamType = null;
}
