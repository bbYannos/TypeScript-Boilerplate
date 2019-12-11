import {AbstractApiModel} from "shared/abstract-api";
import {JsonObject, JsonProperty, RelationConverter} from "shared/json2typescript";
import {Exam} from "../Exam/Exam.Model";
import {Trainee} from "../Trainee/Trainee.Model";

@JsonObject("ExamScore")
export class ExamScore extends AbstractApiModel {
  public constructorName: string = "ExamScore";

  public get label() {
    return this.trainee.shortName + " " + this.exam.label;
  }

  @JsonProperty("exam", RelationConverter, true)
  public exam: Exam = null;

  @JsonProperty("trainee", RelationConverter, true)
  public trainee: Trainee = null;

  @JsonProperty("score", Number, true)
  public score: number = null;
}
