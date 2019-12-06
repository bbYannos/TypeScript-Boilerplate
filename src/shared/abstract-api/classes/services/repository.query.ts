import {ObjectUtils} from "../../object.utils";
import {AbstractApiModel} from "../models";

export abstract class AbstractApiQuery<T extends AbstractApiModel> {
  protected abstract equals: string[];

  public test(object: T) {
    let test = true;
    this.equals.forEach((property) => {
      if (!this.compareProperty(property, object)) {
        test = false;
      }
    });
    return test;
  }

  protected compareProperty(propertyName: string, object: T) {
    const requestProperty = this[propertyName];
    if (requestProperty === null) {
      return true;
    }
    const objectProperty = object[propertyName as keyof T];
    return ObjectUtils.compare(requestProperty, objectProperty);
  }

  public filter(objects: T[]) {
    return objects.filter((object) => this.test(object))
  }
}
