import {ObjectList} from "../lists";
import {AbstractApiModel} from "../models";
import {AbstractRepositoryService} from "../services/repository-service.model";
import {ChildrenListFactory} from "./children-list.factory";
import {OneToOneRelation} from "./one-to-one.relation";

export class OneToParentRelation<T extends AbstractApiModel, U extends AbstractApiModel> extends OneToOneRelation<T, U> {
  constructor(
    public property: keyof T = null,
    public parentProperty: keyof U = null,
    public service: AbstractRepositoryService<U> = null,
  ) {
    super(property, service);
  }

  protected propPrefix = "__bby_prop__";
  protected callBacksPrefix = "__bby_cb_func__";

  public updateOnChange(object: T, previousParent: U, newParent: U) {
    if (previousParent !== null) {
      const childrenList = ChildrenListFactory.getChildrenListForProperty(previousParent, (this.parentProperty as string));
      if (childrenList) {
        childrenList.list.delete(object);
      } else {
        throw new Error(object.constructorName + " " + this.property + " " + this.service.name);
      }
    }
    if (newParent !== null) {
      this.log("OneToParentRelation : add to parent list ", newParent.identifier);
      ChildrenListFactory.getChildrenListForProperty(newParent, (this.parentProperty as string)).list.push(object);
    }
  }

  public updateOnDelete(object: T, previousValue: boolean, newValue: boolean) {
    if (newValue && !previousValue) {
      object[this.property] = null;
    }
  }

  public listenObject(object: T) {
    this.listen(object, this.property, (_object: T, previousParent: U, newParent: U) => this.updateOnChange(_object, previousParent, newParent));
    this.listen(object, "deleted", (_object: T, previousValue: boolean, newValue: boolean) => this.updateOnDelete(_object, previousValue, newValue));
  }

  public unListenObject(object: T) {
    this.unListen(object, this.property);
    this.unListen(object, "deleted");
  }

  protected setObjectPropertyInitialValue(object, value) {
    object[this.propPrefix + this.property] = value;
    object[this.callBacksPrefix + this.property].forEach((_cb) => _cb(object, null, value));
  }

  protected listen<V>(object: T, property: keyof T, cb: (object: T, oldValue: V, newValue: V) => void) {
    if (cb === null) {
      return;
    }
    let cbArray: Array<(object: T, oldValue: V, newValue: V) => void> = object[this.callBacksPrefix + property];
    if (!cbArray) {
      cbArray = object[this.callBacksPrefix + property] = [];
    } else {
      cbArray.push(cb);
      return;
    }

    const protectedName = this.propPrefix + property;
    const attributes = {
      get: () => {
        return object[protectedName];
      },
      set: (_value: any) => {
        this.log("Listened relation : set " + property + " to ", _value);
        const previous = object[protectedName];
        object[protectedName] = _value;
        // set value before callBack chain
        cbArray.forEach((_cb) => _cb(object, previous, _value));
      },
    };
    const value = (object[property] !== undefined) ? object[property] : null;
    Object.defineProperty(object, protectedName, {value: value, writable: true, configurable: true});
    Object.defineProperty(object, property, attributes);
  }

  protected unListen(object: T, property: keyof T) {
    if (!object[this.callBacksPrefix + property]) {
      return;
    }
    const value = (object[this.propPrefix + property]) ? object[this.propPrefix + property] : null;
    Object.defineProperty(object, property, {value: value, writable: true});
    delete object[this.propPrefix + property];
    delete object[this.callBacksPrefix + property];
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
