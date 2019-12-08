import {Availability, Formation, Session, Speaker} from "..";
import moment from "shared/moment/moment"
import {combineLatest, Observable, of} from "rxjs";
import {map, share, switchMap} from "rxjs/operators";
import {AvailabilityInstanceUtil} from "./AvailabilityInstance.Util";

export class FormationUtil {
  public static getAvailableSessions$(formation: Formation, startTime: moment.Moment = null, endTime: moment.Moment = null, speaker: Speaker = null): Observable<Session[]> {
    const availableSessions$ = AvailabilityInstanceUtil.getByFormationExcludingVacations$(formation, startTime, endTime).pipe(
      // tap((session) => console.log('FormationUtil SESSIONS :', session )),
      switchMap((availabilities: Availability[]) => {
        if (speaker !== null) {
          return speaker.availabilities$.pipe(
            map((speakerAvailabilities) => AvailabilityInstanceUtil.filterAvailabilitiesForSpeaker(availabilities, speakerAvailabilities))
          );
        } else {
          return of(availabilities);
        }
      }),
      map((availabilities: Availability[]) => {
        return AvailabilityInstanceUtil.toSessions(availabilities)
      })
    );

    if (speaker === null) {
      return availableSessions$;
    }

    /* tiens compte des cours déjà attribués */
    return combineLatest([availableSessions$, speaker.sessions$]).pipe(
      map(([availableSessions, speakerSessions]) => {
        return availableSessions.filter((availableSession: Session) => {
          let response = true;
          speakerSessions.forEach((speakerSession: Session) => {
            if (availableSession.startTime.isBefore(speakerSession.endTime) && availableSession.endTime.isAfter(speakerSession.startTime)) {
              response = false;
            }
          });
          return response;
        })
      }),
      share(),
    );
  }
}
