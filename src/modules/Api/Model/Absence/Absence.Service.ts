import {Observable} from "rxjs";
import {AbstractApiQuery, DexieRestService, Repository} from "shared/abstract-api";
import {Trainee} from "../Trainee/Trainee.Model";
import {Absence} from "./Absence.Model";

export {Absence};
export class AbsenceQuery extends AbstractApiQuery<Absence> {
  public trainee: Trainee = null;
  public delay: boolean = null;
  protected equals = ["trainee", "delay"];
}

// tslint:disable-next-line:max-classes-per-file
export class AbsenceService extends DexieRestService<Absence> {
  public repository: Repository<Absence> = new Repository(Absence);

  public getByTrainee(trainee: Trainee) {
    const query = new AbsenceQuery();
    query.trainee = trainee;
    return this.list(query);
  }

  public createByQuery<T extends AbsenceQuery>(query: AbsenceQuery): Observable<Absence> {
    const absence = this.repository.makeNew();
    absence.delay = query.delay;
    // todo: get trainee startTime of this day
    absence.startTime = absence.startTime.startOf("day").add(9, "hour");
    if (!absence.delay) {
      absence.endTime = absence.startTime.clone().add(3, "hour");
    }
    absence.trainee = query.trainee;
    return this.create(absence);
  }
}
