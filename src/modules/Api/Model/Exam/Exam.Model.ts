import {Observable} from "rxjs";
import {AbstractApiModel, ChildrenListFactory} from "shared/abstract-api";
import {JsonObject, JsonProperty, MomentConverter, RelationConverter} from "shared/json2typescript";
import moment from "shared/moment/moment";
import {ExamScore} from "../ExamScore";
import {ExamType} from "../ExamType/ExamType.Model";
import {Trainee} from "../Trainee";
import {Training} from "../Training/Training.Model";

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

  public scores$: Observable<ExamScore[]> = null;

  public get scores(): ExamScore[] {
   return ChildrenListFactory.getChildrenListForProperty(this, "scores$").list.toArray() as ExamScore[];
  }

  public get coefficient(): number {
    return (this.examType !== null) ? this.examType.coefficient : 1;
  }

  public getScoreByTrainee: (trainee: Trainee) => ExamScore = null;
}
