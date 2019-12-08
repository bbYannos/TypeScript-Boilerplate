import {combineLatest} from "rxjs";
import {auditTime, map, shareReplay, tap} from "rxjs/operators";
import {AbstractRelationManager, OneToOneRelation, ServiceFactory} from "shared/abstract-api";
import moment from "shared/moment/moment";
import {Speaker} from "../Model/Speaker.Model";
import {Availability, AvailabilityService} from "../Service/Availability.Service";
import {Formation, FormationService} from "../Service/Formation.Service";

import {FormationUtil} from "../Util/Formation.Util";

export class FormationRelationManager extends AbstractRelationManager<Formation> {
  protected Service = FormationService;
  protected oneToOneRelations: Array<OneToOneRelation<Formation, any>> = [];

  public manageChildrenLists(object: Formation, json: any): Formation {
    super.manageChildrenLists(object, json);
    this.fetchAllVacations$(object);
    this.fetchAvailableSessions$(object);
    return object;
  }

  /**
   * Return combine Formation.vacations$ end globalVacations$
   * WRAPPED IN A FUNCTION TO AVOID DIRECT CALL ON CONSTRUCTION
   */
  protected fetchAllVacations$(object: Formation) {
    const property = "allVacations$";
    const value = () => {
      return combineLatest([
        ServiceFactory.getService(AvailabilityService).globalVacations$.pipe(
          tap((res) =>  this.log("globalVacations$", res.length)),
        ),
        object.vacations$.pipe(
          tap((res) =>  this.log("vacations$", res.length)),
        ),
      ]).pipe(
        auditTime(10),
        map((vacationsArray: Availability[][]) => vacationsArray.flat()),
        tap((res: Availability[]) => {
          res.forEach((re) => this.log(re.open, re.global));
        }),
        shareReplay(1),
      );
    };
    Object.defineProperty(object, property, {get: value});
  }

  protected fetchAvailableSessions$(object: Formation) {
    const property = "availableSessions$";
    const attributes = {
      value: (startTime: moment.Moment = null, endTime: moment.Moment = null, _speaker: Speaker = null) => {
        return FormationUtil.getAvailableSessions$(object, startTime, endTime, _speaker);
      },
    };
    Object.defineProperty(object, property, attributes);
  }
}

export const formationRelationManager = new FormationRelationManager();
formationRelationManager.debug = false;
formationRelationManager.init();
