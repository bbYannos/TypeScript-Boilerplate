import {RelationManager} from "shared/abstract-api";
import moment from "shared/moment";
import {FormationUtil} from "../../Util/Formation.Util";
import {Speaker} from "../Speaker/Speaker.Model";
import {Formation, FormationService} from "./Formation.Service";

class FormationRelationManager extends RelationManager<Formation> {

  public manageChildrenLists(object: Formation, json: any): Formation {
    super.manageChildrenLists(object, json);
    this.fetchAvailableSessions$(object);
    return object;
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

const formationService = RelationManager.makeService<Formation, FormationService>(FormationService, [], FormationRelationManager);


export {Formation, FormationService, formationService};
