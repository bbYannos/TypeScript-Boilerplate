import {RelationManager} from "shared/abstract-api";
import moment from "shared/moment";
import {FormationUtil} from "../../Util/Formation.Util";
import {Speaker} from "../Speaker/Speaker.Model";
import {Formation, FormationService} from "./Formation.Service";

const formationService = RelationManager.makeService<Formation, FormationService>(FormationService, []);
formationService.repository.relationManager.finalizeFunctions.push(
  (object: Formation) => {
    const property = "availableSessions$";
    const attributes = {
      value: (startTime: moment.Moment = null, endTime: moment.Moment = null, _speaker: Speaker = null) => {
        return FormationUtil.getAvailableSessions$(object, startTime, endTime, _speaker);
      },
    };
    Object.defineProperty(object, property, attributes);
  },
);
export {Formation, FormationService, formationService};
