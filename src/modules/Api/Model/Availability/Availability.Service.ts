import {Observable, pipe} from "rxjs";
import {map} from "rxjs/operators";
import {AbstractApiQuery, DexieRestService, Repository} from "shared/abstract-api";
import moment from "shared/moment/moment";
import {ObjectUtils} from "shared/utils/object.utils";
import {Formation} from "../Formation/Formation.Model";
import {Speaker} from "../Speaker/Speaker.Model";
import {Availability} from "./Availability.Model";

export {Availability};
export class AvailabilityQuery extends AbstractApiQuery<Availability> {
  public global?: boolean = null;
  public open?: boolean = null;
  public startTime?: moment.Moment = null;
  public endTime?: moment.Moment = null;
  public parent?: Formation | Speaker = null;
  public parentClass?: string = null;
  protected equals = ["parent", "parentClass", "global", "open"];

  public setParentAndClass(object: Formation | Speaker) {
    if (object !== null) {
      this.parent = object;
      this.parentClass = object.constructorName;
    }
  }
}

// tslint:disable-next-line:max-classes-per-file
export class AvailabilityService extends DexieRestService<Availability> {
  public defaultSort = () => pipe(map((objects: Availability[]) =>
    objects.sort((period1, period2) => {
      if (!ObjectUtils.isValidMoment(period1.startTime)) {
        return -1;
      }
      if (!ObjectUtils.isValidMoment(period2.startTime)) {
        return 1;
      }
      return (period1.startTime.isAfter(period2.startTime)) ? 1 : -1;
    }),
  ));

  public repository: Repository<Availability> = new Repository(Availability);

  // return only globals vacations
  public get globalVacations$(): Observable<Availability[]> {
    return this.fetchAll$.pipe(
      map((availabilities: Availability[]) =>
        availabilities.filter((availability: Availability) =>  availability.global && !availability.open),
      ),
    );
  }

  public createByQuery(query: AvailabilityQuery): Observable<Availability> {
    // todo: Generic createByQuery: makeNew then set properties then set foreign
    const availability = this.repository.makeNew();
    availability.startTime = (ObjectUtils.isValidMoment(query.startTime)) ? query.startTime.clone() : null;
    availability.endTime = (ObjectUtils.isValidMoment(query.endTime)) ? query.endTime.clone() : null;
    availability.open = query.open;
    // Keep set foreign at the end to avoid multiple parent call / sure parent is called with good parameters
    // Keep parentClass before parent
    availability.parentClass = query.parentClass;
    availability.parent = query.parent;
    return this.create(availability);
  }

  public getByFormation(formation: Formation): Observable<Availability[]> {
    const query = new AvailabilityQuery();
    query.setParentAndClass(formation);
    return this.list(query);
  }
  public getBySpeaker(speaker: Speaker): Observable<Availability[]> {
    const query = new AvailabilityQuery();
    query.setParentAndClass(speaker);
    return this.list(query);
  }
}
