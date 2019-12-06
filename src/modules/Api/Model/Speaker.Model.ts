import {combineLatest, Observable, of} from "rxjs";
import {map, share, switchMap} from "rxjs/operators";
import {JsonObject} from "shared/json2typescript";
import moment from "shared/moment/moment";
import {Formation} from "..";
import {Availability} from "./Availability.Model";
import {Session} from "./Session.Model";
import {Training} from "./Training.Model";
import {User} from "./User.Model";

@JsonObject("Speaker")
export class Speaker extends User {
  public constructorName = "Speaker";

  public trainings$: Observable<Training[]> = null;

  public vacations$: Observable<Availability[]> = of([]);

  public allAvailabilities$: Observable<Availability[]> = null;

  public availableSessions$: (startTime?: moment.Moment, endTime?: moment.Moment) => Observable<Session[]> = null;

  public get availabilities$() {
    return this.allAvailabilities$.pipe(
      map((availabilities: Availability[]) =>
        availabilities.filter(
          (availability: Availability) => availability.open),
      ),
    );
  }

  public get sessions$(): Observable<Session[]> {
    return this.trainings$.pipe(
      switchMap((trainings: Training[]) => {
        const sessions$ = trainings.map((training: Training) => training.sessions$);
        return combineLatest(sessions$).pipe(
          map((sessionsArray: Session[][]) => sessionsArray.flat()),
          share(),
        );
      }),
    );
  }

  public getTrainingHoursByFormation(formation: Formation): Observable<moment.Duration> {
    return this.trainings$.pipe(
      map((trainings: Training[]) => {
          const duration = moment.duration();
          trainings
          .filter((training: Training) => training.formation !== null && training.formation.isSame(formation))
          .map((training: Training) => duration.add(training.duration));
          return duration;
        },
      ),
    );
  }
}
