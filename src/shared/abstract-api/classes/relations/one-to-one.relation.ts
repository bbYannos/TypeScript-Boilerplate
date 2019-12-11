import {of} from "rxjs";
import {map, tap} from "rxjs/operators";
import {ObjectUtils} from "shared/utils/object.utils";
import {AbstractApiModel, AbstractIdentifiedObject, Debuggable} from "../models";
import {AbstractRepositoryService} from "../services/repository-service.model";

export class OneToOneRelation<T extends AbstractApiModel, U extends AbstractApiModel> extends Debuggable {
  public updateOnChange?: (object: T, previousParent: U, newParent: U) => void = null;
  public updateOnDelete?: (object: T, previousValue: boolean, newValue: boolean) => void = null;

  public listenObject: (object: T) => void = null;
  public unListenObject: (object: T) => void = null;

  constructor(public property: keyof T = null, public service: AbstractRepositoryService<U> = null) {
    super();
  }

  // noinspection JSUnusedLocalSymbols
  public getServiceForForeign(object: T) {
    return this.service;
  }

  // Function called after json -> object
  // Fetch foreign objects for the new created object
  public fetchForeign$(object: T, json: any = null) {
    const foreignJson = this.getForeignJson(json);
    if (foreignJson !== null) {
      this.log("Foreign Json Found : ");
      const _service = this.getServiceForForeign(object);
      this.log("Used Service : " + _service.name);
      this.log("Json Sent : ", foreignJson);
      return _service.repository.fromJson$(foreignJson).pipe(
        map((foreignObject: any) => {
          object[this.property] = foreignObject;
          return object;
        }),
      );
    }
    const identifiedObject = this.getForeignIdentifiedObject(object);
    this.log("Current foreign : ", identifiedObject);
    if (identifiedObject === null) {
      return of(null);
    }
    // set to null to remove incomplete object : { identifier: "api_xxx" }
    // Foreign properties are listened yet
    object["_" + this.property] = null;
    const identifier = identifiedObject.identifier;
    const service = this.getServiceForForeign(object);
    this.log("Used Service : " + service.name);
    return service.getByIdentifier$(identifier).pipe(
      tap((foreign: any) => {
        if (foreign !== null) {
          this.log(object.constructorName + " foreign found for : " + this.property, foreign);
          object[this.property] = foreign;
        } else {
          this.log(object.constructorName + " foreign not found for : " + this.property, foreign);
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
