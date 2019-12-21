import {of} from "rxjs";
import {map, tap} from "rxjs/operators";
import {ObjectUtils} from "shared/utils/object.utils";
import {AbstractApiModel, AbstractIdentifiedObject, Debuggable} from "../models";
import {AbstractRepositoryService} from "../services/repository-service.model";

export class OneToOneRelation<T extends AbstractApiModel, U extends AbstractApiModel> extends Debuggable {
  constructor(public property: keyof T = null, public service: AbstractRepositoryService<U> = null) {
    super();
  }

  // noinspection JSUnusedLocalSymbols
  public updateOnChange(object: T, previousParent: U, newParent: U): void {
    return;
  }

  // noinspection JSUnusedLocalSymbols
  public updateOnDelete(object: T, previousValue: boolean, newValue: boolean): void {
    return;
  }

  // noinspection JSUnusedLocalSymbols
  public listenObject(object: T): void {
    return;
  }

  // noinspection JSUnusedLocalSymbols
  public unListenObject(object: T): void {
    return;
  }

// noinspection JSUnusedLocalSymbols
  public getServiceForForeign(object: T) {
    return this.service;
  }

  protected setObjectPropertyInitialValue(object, value) {
    object[this.property] = value;
  }

  // Function called after json -> object
  // Fetch foreign objects for the new created object
  public fetchForeign$(object: T, json: any = null) {
    this.log("RELATION FETCH FOREIGN START TO POPULATE " + this.getServiceForForeign(object).name + " IN " + object.constructorName + " " + object.identifier);
    const foreignJson = this.getForeignJson(json);
    if (foreignJson !== null) {
      this.log("Foreign Json Found : ");
      const _service = this.getServiceForForeign(object);
      this.log("Used Service : " + _service.name);
      this.log("Json Sent : ", foreignJson);
      return _service.repository.fromJson$(foreignJson).pipe(
        map((foreignObject: any) => {
          this.setObjectPropertyInitialValue(object, foreignObject);
          return object;
        }),
      );
    }
    const identifiedObject = this.getForeignIdentifiedObject(object);
    this.log("Current foreign : ", identifiedObject);
    if (identifiedObject === null) {
      return of(null);
    }

    // Foreign properties are listened yet
    const identifier = identifiedObject.identifier;
    const service = this.getServiceForForeign(object);
    this.log("Used Service : " + service.name);
    return service.getByIdentifier$(identifier).pipe(
      tap((foreignObject: any) => {
        if (foreignObject !== null) {
          this.log(object.constructorName + " foreign found for : " + this.property, foreignObject);
          // console.log("OBJECT " + object.constructorName, object);
          // console.log("OBJECT _FOREIGN ", object["_" + this.property]);
          // console.log("FOREIGN " + this.property, foreignObject);
          // console.log("FOREIGN CURRENT VALUE IN OBJECT", object[this.property]);
          this.setObjectPropertyInitialValue(object, foreignObject);
          // console.log("FOREIGN VALUE AFTER SET", object[this.property]);
        } else {
          this.log(object.constructorName + " foreign not found for : " + this.property, foreignObject);
          this.log("Seeking on : " + this.getServiceForForeign(object).name);
          this.log(service.repository.constructorName + " not found for " + object.constructorName + " : ", identifiedObject);
          object[this.property] = null;
        }
      }),
    );
  }

  protected getForeignIdentifiedObject(object: T): AbstractIdentifiedObject {
    return object[this.property] as any as AbstractIdentifiedObject;
  }

  protected getForeignJson(json: any) {
    if (json === null) {
      return null;
    }
    const property = json[this.property];
    if (property === null) {
      return null;
    }
    if (ObjectUtils.getTypeOf(property) !== "object") {
      return null;
    }
    return property;
  }
}
