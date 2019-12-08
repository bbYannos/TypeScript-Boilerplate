import {ObjectList} from "../lists";
import {AbstractApiModel} from "../models";
import {AbstractRepositoryService} from "../services/repository-service.model";
import {ChildrenListFactory} from "./children-list.factory";
import {OneToOneRelation} from "./one-to-one.relation";

export class OneToParentRelation<T extends AbstractApiModel, U extends AbstractApiModel> extends OneToOneRelation<T, U> {
  constructor(
    public property: keyof T = null,
    public parentProperty: keyof U = null,
    public service: AbstractRepositoryService<U> = null
  ) {
    super(property, service);
  }

  public updateOnChange = (object: T, previousParent: U, newParent: U) => {
    if (previousParent !== null) {
      ChildrenListFactory.getChildrenListForProperty(previousParent, (this.parentProperty as string)).list.delete(object);
    }
    if (newParent !== null) {
      this.log("OneToParentRelation : add to parent list ", newParent.identifier);
      ChildrenListFactory.getChildrenListForProperty(newParent, (this.parentProperty as string)).list.push(object);
    }
  };

  public updateOnDelete = (object: T, previousValue: boolean, newValue: boolean) => {
    if (newValue && !previousValue) {
      object[this.property] = null;
    }
  };

  public listenObject = (object: T) => {
    this.listen(object, this.property, this.updateOnChange);
    this.listen(object, "deleted", this.updateOnDelete);
  };

  public unListenObject = (object: T) => {
    this.unListen(object, this.property);
    this.unListen(object, "deleted");
  };

  protected listen<V>(object: T, property: keyof T, cb: (object: T, oldValue: V, newValue: V) => void) {
    if (cb === null) {
      return;
    }
    let cbArray: Array<(object: T, oldValue: V, newValue: V) => void> = object["__" + property + "_cb_func_bby__"];
    if (!cbArray) {
      cbArray = object["__" + property + "_cb_func_bby__"] = [];
    }
    cbArray.push(cb);

    // noinspection JSUnusedGlobalSymbols
    const attributes = {
      get: () => {
        return object["_" + property];
      },
      set: (_value: any) => {
        this.log("Listened relation : set " + property + " to ", _value);
        const previous = object["_" + property];
        object["_" + property] = value;
        // set value before callBack chain
        cbArray.forEach((_cb) => _cb(object, previous, _value));
      },
    };
    const value = (object[property] !== undefined) ? object[property] : null;
    Object.defineProperty(object, "_" + property, {value: value, writable: true, configurable: true});
    Object.defineProperty(object, property, attributes);
  }

  protected unListen(object: T, property: keyof T) {
    const value = (object["_" + property]) ? object["_" + property] : null;
    Object.defineProperty(object, property, {value: value, writable: true});
    delete object["_" + property];
    delete object["__" + property + "_cb_func_bby__"];
  }

  protected getParent(object: T): U {
    return object[this.property] as any as U;
  }

  protected getParentList<W extends ObjectList<T>>(object): W {
    const parent = this.getParent(object);
    const childrenList = ChildrenListFactory.getChildrenListForProperty(parent, (this.parentProperty as string));
    if (childrenList) {
      return childrenList.list as W;
    }
    return null;
  }
}
