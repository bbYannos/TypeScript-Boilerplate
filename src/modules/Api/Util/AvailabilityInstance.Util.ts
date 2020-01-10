import {combineLatest, Observable, of} from "rxjs";
import {debounceTime, map} from "rxjs/operators";
import moment, {adjustWeekOfMomentToOtherMoment} from "shared/moment";
import {ObjectUtils} from "shared/utils/object.utils";
import {Availability} from "../Model/Availability/Availability.Model";
import {Formation} from "../Model/Formation/Formation.Model";
import {Session} from "../Model/Session/Session.Model";


export class AvailabilityInstanceUtil {
  /* return all instances - Vacations are excluded **/
  public static getByFormationExcludingVacations$(
    formation: Formation,
    startTime: moment.Moment = null,
    endTime: moment.Moment = null,
  ): Observable<Availability[]> {
    if (startTime === null && ObjectUtils.isValidMoment(formation.startTime)) {
      startTime = formation.startTime.clone();
    }
    if (endTime === null && ObjectUtils.isValidMoment(formation.endTime)) {
      endTime = formation.endTime.clone();
    }
    if (startTime === null || endTime === null) {
      return of([]);
    }
    // console.log(startTime.format(), endTime.format());
    return combineLatest([formation.availabilities$, formation.allVacations$]).pipe(
      debounceTime(10),
      map(([availabilities, vacations]: [Availability[], Availability[]]) => {
        return this.getInstancesExcludingVacations(availabilities, startTime, endTime, vacations);
        // console.log('AVAILABILITIES : ', availabilities);
        // console.log('VACATIONS : ', vacations);
        // console.log('INSTANCES : ', instances);
      }),
    );
  }

  public static getCommonAvailabilities(availabilities1: Availability[], availabilities2: Availability[]): Availability[] {
    return availabilities1.filter((availability1: Availability) => {
      let available = false;
      if (availabilities2.length === 0) {
        return true;
      }
      availabilities2.forEach((availability2: Availability) => {
        if (!availability2.startTime.isAfter(availability1.startTime) && !availability2.endTime.isBefore(availability1.endTime)) {
          available = true;
        }
      });
      return available;
    });
  }

  public static getInstancesExcludingVacations(
    availabilities: Availability[],
    _startTime: moment.Moment,
    _endTime: moment.Moment, vacations: Availability[] = [],
  ): Availability[] {
    let availabilitiesInstances = [];
    const startTime = _startTime.clone();
    const endTime = _endTime.clone();
    while (startTime.isBefore(endTime)) {
      const availabilitiesByDay = availabilities.filter(
        (availability: Availability) => (
          moment.isMoment(availability.startTime) &&
          availability.startTime.format("d") === startTime.format("d")
        ),
      ).map((_availability: Availability) => {
        /* Helper object - no need to manage relations **/
        const availability = new Availability(true);
        availability.startTime = startTime.clone().hours(_availability.startTime.hours()).minutes(_availability.startTime.minutes());
        availability.endTime = startTime.clone().hours(_availability.endTime.hours()).minutes(_availability.endTime.minutes());
        availability.identifier = availability.startTime.format();
        // availability.instanceOf = _availability;
        return availability;
      }).filter((availability: Availability) => {
        let valid = true;
        vacations.forEach((vacation: Availability) => {
          if (availability.startTime.isAfter(vacation.startTime) && availability.endTime.isBefore(vacation.endTime.endOf("day"))) {
            valid = false;
          }
        });
        return valid;
      });
      availabilitiesInstances = availabilitiesInstances.concat(availabilitiesByDay);
      startTime.add(1, "day");
    }
    return availabilitiesInstances;
  }

  public static toSessions(availabilities: Availability[]): Session[] {
    return availabilities.map((availability: Availability) => this.toSession(availability));
  }

  public static toSession(availability: Availability): Session {
    /* to survey */
    const session = new Session(true);
    /* to survey */
    session.startTime = availability.startTime;
    session.endTime = availability.endTime;
    return session;
  }
}
