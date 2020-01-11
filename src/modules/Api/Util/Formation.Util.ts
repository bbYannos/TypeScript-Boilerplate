import {combineLatest, forkJoin, Observable, of} from "rxjs";
import {map, take} from "rxjs/operators";
import moment from "shared/moment";
import {Availability} from "../Model/Availability/Availability.Model";
import {Formation} from "../Model/Formation/Formation.Model";
import {Session} from "../Model/Session/Session.Model";
import {Speaker} from "../Model/Speaker/Speaker.Model";
import {AvailabilityInstanceUtil} from "./AvailabilityInstance.Util";

export class FormationUtil {
  public static getAvailableSessions$(formation: Formation, startTime: moment.Moment = null, endTime: moment.Moment = null, speaker: Speaker = null): Observable<Session[]> {
    const speakerAvailabilities$ = (speaker !== null) ? speaker.availabilities$ : of([]);
    const speakerSessions$ = (speaker !== null) ? speaker.sessions$.pipe(take(1)) : of([]);

    const formationAvailabilities$ = combineLatest([formation.availabilities$, speakerAvailabilities$]).pipe(
      map(([formationAvailabilities, speakerAvailabilities]: [Availability[], Availability[]]) =>
        AvailabilityInstanceUtil.getAvailabilitiesIntersection(formationAvailabilities, speakerAvailabilities),
      ),
    );

    const formationSessions$ = combineLatest([formationAvailabilities$, formation.allVacations$]).pipe(
      map(([availabilities, vacations]: [Availability[], Availability[]]) =>
        AvailabilityInstanceUtil.toSessions(
          AvailabilityInstanceUtil.getInstancesExcludingVacations(availabilities, startTime, endTime, vacations)
        ),
      ),
    );

    return combineLatest([formationSessions$, speakerSessions$]).pipe(
      map(([formationSessions, speakerSessions]) => formationSessions.filter((availableSession: Session) => {
          let response = true;
          speakerSessions.forEach((speakerSession: Session) => {
            if (availableSession.startTime.isBefore(speakerSession.endTime) && availableSession.endTime.isAfter(speakerSession.startTime)) {
              response = false;
            }
          });
          return response;
        }),
      ),
    );
  }
}
