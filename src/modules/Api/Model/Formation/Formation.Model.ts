import {MODULES_CONSTANTS} from "modules/modules.constants";
import {Observable} from "rxjs";
import {map, shareReplay, switchMap} from "rxjs/operators";
import {AbstractPeriod, RxjsUtils} from "shared/abstract-api";
import {DurationConverter, JsonObject, JsonProperty, MomentConverter, TimeConverter} from "shared/json2typescript";
import moment from "shared/moment";
import {Availability} from "../Availability/Availability.Model";
import {Module} from "../Module/Module.Model";
import {Session} from "../Session/Session.Model";
import {Speaker} from "../Speaker/Speaker.Model";
import {Training} from "../Training/Training.Model";

@JsonObject("Formation")
export class Formation extends AbstractPeriod {
  public constructorName = "Formation";

  @JsonProperty("label", String, true)
  public label: string = "";

  @JsonProperty("defaultDuration", DurationConverter, true)
  public defaultDuration: moment.Duration = moment.duration(3, "hours");

  @JsonProperty("hourMin", TimeConverter)
  public hourMin: moment.Moment = MODULES_CONSTANTS.SCHEDULE.OPENING;

  @JsonProperty("hourMax", TimeConverter)
  public hourMax: moment.Moment = MODULES_CONSTANTS.SCHEDULE.CLOSING;


  public modules$: Observable<Module[]> = null;

  public trainings$: Observable<Training[]> = null;

  public allAvailabilities$: Observable<Availability[]> = null;
  public allVacations$: Observable<Availability[]> = null;
  public availableSessions$: (startTime?: moment.Moment, endTime?: moment.Moment, speaker?: Speaker) => Observable<Session[]> = null;

  public get availabilities$(): Observable<Availability[]> {
    return this.allAvailabilities$.pipe(
      map((availabilities: Availability[]) =>
        availabilities.filter(
          (availability: Availability) => availability.open),
      ),
    );
  }

  public get vacations$(): Observable<Availability[]> {
    return this.allAvailabilities$.pipe(
      map((availabilities: Availability[]) =>
        availabilities.filter(
          (availability: Availability) =>  !availability.open && !availability.global),
      ),
      shareReplay(1),
    );
  }

  public get sessions$(): Observable<Session[]> {
    return this.trainings$.pipe(
      switchMap((trainings: Training[]) => {
        const sessions$ = trainings.map((training: Training) => training.sessions$);
        return RxjsUtils.combineLatest(sessions$).pipe(
          map((sessionsArray: Session[][]) => sessionsArray.flat()),
          shareReplay(1),
        );
      }),
    );
  }
}
