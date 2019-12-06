import * as moment from "moment";
import {JsonProperty, MomentConverter} from "shared/json2typescript";
import {ObjectList} from "../lists";
import {ChildrenListFactory} from "../relations/children-list.factory";
import {ChildrenList} from "../relations/children-list.model";
import {AbstractIdentifiedObject} from "./identified.model";

export abstract class AbstractApiModel extends AbstractIdentifiedObject {

  @JsonProperty("createdAt", MomentConverter, true)
  public createdAt: moment.Moment = null;
  @JsonProperty("updatedAt", MomentConverter, true)
  public updatedAt: moment.Moment = null;
  public lists: Array<ChildrenList<AbstractApiModel>> = [];

  protected constructor(fromRepository = false) {
    super();
    if (fromRepository === false) {
      console.log("Api Model constructed directly : Relations won\"t be managed. Prefer using repository.makeNew()");
    }
  }

  protected getList<U extends ObjectList<any>>(propertyName: keyof this) {
    return ChildrenListFactory.getChildrenListForProperty(this, propertyName as string).list as U;
  }
}
