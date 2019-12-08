import {MODULES_CONSTANTS} from "modules/modules.constants";
import {DexieRestService, ObjectUtils, Repository} from "shared/abstract-api";
import moment from "shared/moment/moment";
import {Formation} from "../Model/Formation.Model";

export class FormationService extends DexieRestService<Formation> {
  public repository: Repository<Formation> = new Repository<Formation>(Formation);

  public get hourMin(): moment.Moment {
    const hour = this.repository.toArray().map((formation: Formation) => formation.hourMin)
    .sort(
      (hour1: moment.Moment, hour2: moment.Moment) => {
        if (!ObjectUtils.isValidMoment(hour1)) {
          return -1;
        }
        if (!ObjectUtils.isValidMoment(hour2)) {
          return 1;
        }
        return (hour1.isBefore(hour2)) ? 1 : -1;
      },
    ).pop();
    return (hour) ? hour : MODULES_CONSTANTS.SCHEDULE.OPENING;
  }

  public get hourMax(): moment.Moment {
    const hour = this.repository.toArray().map((formation: Formation) => formation.hourMax)
    .sort(
      (hour1: moment.Moment, hour2: moment.Moment) => {
        if (!ObjectUtils.isValidMoment(hour1)) {
          return -1;
        }
        if (!ObjectUtils.isValidMoment(hour2)) {
          return 1;
        }
        return (hour1.isAfter(hour2)) ? 1 : -1;
      },
    ).pop();
    return (hour) ? hour : MODULES_CONSTANTS.SCHEDULE.CLOSING;
  }

  public get startTime(): moment.Moment {
    if (this.timedFormations.length === 0) {
      return null;
    }
    return this.timedFormations
    .sort((formation1: Formation, formation2: Formation) => {
      return (formation1.startTime.isBefore(formation2.startTime)) ? -1 : 1;
    }).map((formation: Formation) => formation.startTime).shift().clone();
  }

  public get endTime(): moment.Moment {
    if (this.timedFormations.length === 0) {
      return null;
    }
    return this.timedFormations
    .sort((formation1: Formation, formation2: Formation) =>
      (formation1.endTime.isAfter(formation2.endTime)) ? -1 : 1,
    ).map((formation: Formation) => formation.endTime).shift().clone();
  }

  protected get timedFormations(): Formation[] {
    return this.repository.toArray().filter(
      (formation: Formation) => ObjectUtils.isValidMoment(formation.startTime) && ObjectUtils.isValidMoment(formation.endTime),
    );
  }
}
