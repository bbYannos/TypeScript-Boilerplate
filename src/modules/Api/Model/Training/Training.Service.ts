import {Observable, pipe} from "rxjs";
import {map} from "rxjs/operators";
import {AbstractApiQuery, DexieRestService, Repository} from "shared/abstract-api";
import moment from "shared/moment/moment";
import {Formation} from "../Formation/Formation.Model";
import {Room} from "../Room/Room.Model";
import {Speaker} from "../Speaker/Speaker.Model";
import {Training} from "./Training.Model";
export {Training};
export class TrainingQuery extends AbstractApiQuery<Training> {
  public formation: Formation = null;
  public speaker: Speaker = null;
  public room: Room = null;
  public startTime: moment.Moment = null;
  public endTime: moment.Moment = null;
  public canHaveExams: boolean = null;
  protected equals = ["formation", "speaker", "room", "canHaveExams"];
}

// tslint:disable-next-line:max-classes-per-file
export class TrainingService extends DexieRestService<Training> {
  public repository = new Repository(Training);

  public getByFormation(formation: Formation): Observable<Training[]> {
    const query = new TrainingQuery();
    query.formation = formation;
    return this.list(query);
  }

  public getBySpeaker(speaker: Speaker): Observable<Training[]> {
    const query = new TrainingQuery();
    query.speaker = speaker;
    return this.list(query);
  }

  public createByQuery(query: TrainingQuery): Observable<Training> {
    const training = this.repository.makeNew();
    training.formation = query.formation;
    if (query.formation) {
      training.duration = training.formation.defaultDuration;
    }
    training.speaker = query.speaker;
    return this.create(training);
  }

  public sort = () => pipe (
    map((trainings: Training[]) => trainings.sort((training1, training2) => {
      // Undefined modules Or Same modules => sort by training label
      if ((!training1.module && !training2.module) ||
        (training1.module && training2.module && training1.module.isSame(training2.module))) {
        return (training1.label > training2.label) ? 1 : -1;
      }
      if (!training1.module) {
        return 1;
      }
      if (!training2.module) {
        return -1;
      }
      return (training1.module.label > training2.module.label) ? 1 : -1;
    })),
  );
}
