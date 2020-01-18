import * as moment from "moment";
import {Observable} from "rxjs";
import {AbstractApiModel, ChildrenListFactory, PeriodList} from "shared/abstract-api";
import {DurationConverter, JsonObject, JsonProperty, RelationConverter} from "shared/json2typescript";
import {Exam} from "../Exam/Exam.Model";
import {Formation} from "../Formation/Formation.Model";
import {Module} from "../Module/Module.Model";
import {Room} from "../Room/Room.Model";
import {Session} from "../Session/Session.Model";
import {Speaker} from "../Speaker/Speaker.Model";
import {Trainee} from "../Trainee";

@JsonObject("Training")
export class Training extends AbstractApiModel {

  public constructorName = "Training";

  @JsonProperty("label", String)
  public label: string = "";

  @JsonProperty("speaker", RelationConverter, true)
  public speaker: Speaker = null;

  @JsonProperty("formation", RelationConverter, true)
  public formation: Formation = null;

  @JsonProperty("module", RelationConverter, true)
  public module: Module = null;

  @JsonProperty("room", RelationConverter, true)
  public room: Room = null;

  @JsonProperty("color", String, true)
  public color: string = "#881C25";

  @JsonProperty("duration", DurationConverter)
  public duration: moment.Duration = moment.duration(0);

  public sessions$: Observable<Session[]> = null;

  public exams$: Observable<Exam[]> = null;

  public get exams(): Exam[] {
    return ChildrenListFactory.getChildrenListForProperty(this, "exams$").list.toArray() as Exam[];
  }

  public get coefficient(): number {
    if (this.module !== null) {
      return this.module.coefficient;
    }
    return 1;
  }

  public get remainingDuration() {
    return this.duration.clone().subtract(this.getList<PeriodList<Session>>("sessions$").duration);
  }

  public get scheduled(): boolean {
    return (this.remainingDuration.asMinutes() === 0);
  }

  public get canHaveExams(): boolean {
    // don't like !! syntax
    // noinspection RedundantConditionalExpressionJS
    return (this.module) ? true : false;
  }
}
