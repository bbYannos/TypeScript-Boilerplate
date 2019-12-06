import moment from "moment";
import {AbstractApiModel} from "./classes/models";


type TypeString = ("boolean" | "number" | "string" | "AbstractModel" | "array" | "moment" | "duration");

export class ObjectUtils {


  public static dexPrefix: string = "dex_";
  public static dexieRegexp = /^dex_\d*$/g;
  public static apiPrefix: string = "api_";
  public static apiRegexp = /^api_\d*$/g;

  public static isDexieIdentifier(value: string): boolean {
    if (typeof value === "string") {
      return (value.match(this.dexieRegexp) !== null);
    }
    return false;
  }

  public static isApiIdentifier(value: string): boolean {
    if (typeof value === "string") {
      return (value.match(this.apiRegexp) !== null);
    }
    return false;
  }

  public static isIdentifier(value: string) {
    return this.isApiIdentifier(value) || this.isDexieIdentifier(value);
  }

  public static isValidMoment(value: any): boolean {
    return (moment.isMoment(value) && value.isValid());
  }
  public static getSetProperty<T>(object: T, property: keyof T, attributes: object) {
    const value = (object[property]) ? object[property] : null;
    Object.defineProperty(object, "_" + property, {value: value, writable: true});
    Object.defineProperty(object, property, attributes);
  }

  public static removeGetSetProperty<T>(object: T, property: keyof T) {
    const value = (object["_" + property]) ? object["_" + property] : null;
    Object.defineProperty(object, property, {value: value, writable: true});
  }

  public static applyMixins(derivedConstructor: any, baseConstructors: any[]) {
    baseConstructors.forEach((baseConstructor) => {
      Object.getOwnPropertyNames(baseConstructor.prototype).forEach((_propertyName) => {
        if (_propertyName !== "constructor" && _propertyName !== "__jsonconvert__class_identifier__") {
          derivedConstructor.prototype[_propertyName] = baseConstructor.prototype[_propertyName];
        }
      });
    });
  }

  public static UniqId(): string {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return "_" + Math.random().toString(36).substr(2, 9);
  }

  public static instanceOfAbstractModel(value: any) {
    return "constructorName" in value;
  }

  public static ObjectToUrlParams(object: any): string[] {
    object = ObjectUtils.objectToJson(object);
    /** @var urlParams array ["key=value"] */
    const urlParams: string[] = [];
    for (const param of Object.keys(object)) {
      if (Array.isArray(param)) {
        const _array: any[] = object[param];
        _array.forEach((value) => {
          urlParams.push(param + "[]" + "=" + encodeURIComponent(value));
        });
      } else {
        urlParams.push(param + "=" + encodeURIComponent(object[param]));
      }
    }
    return urlParams;
  }

  public static objectToJson(object: any = null): any {
    const json = {};
    if (object === null) {
      return json;
    }

    if (Array.isArray(object)) {
      return object.map((_object) => this.objectToJson(_object));
    }
    // noinspection TsLint
    for (const _propertyName in object) {
      json[_propertyName] = this.getJsonValue(object[_propertyName]);
    }
    return json;
  }

  public static requestToJson(object: any = null, booleanToNumber = false) {
    if (object === null) {
      return null;
    }
    const json = {};
    Object.getOwnPropertyNames(object).forEach((_propertyName) => {
      if (
        object[_propertyName] !== null &&
        object[_propertyName] !== undefined &&
        this.getTypeOf(object[_propertyName]) !== "function"
      ) {
        json[_propertyName] = this.getJsonValue(object[_propertyName], booleanToNumber);
      }
    });
    if (Object.getOwnPropertyNames(json).length === 0) {
      return null;
    }
    return json;
  }

  public static getTypeOf(value: TypeString) {
    if (value === undefined) {
      return null;
    }
    if (value === null) {
      return null;
    }
    switch (typeof (value)) {
      case "boolean":
      case "number":
      case "string":
        return typeof (value);
      default:
        if (this.instanceOfAbstractModel(value)) {
          return "AbstractModel";
        }
        if (Array.isArray(value)) {
          return "array";
        }
        if (ObjectUtils.isValidMoment(value)) {
          return "moment";
        }
        if (moment.isDuration(value)) {
          return "duration";
        }
        break;
    }
    return typeof (value);
  }

  public static compare(value1, value2, undefinedValuesAreSame: boolean = true): boolean {
    if (!value1 && !value2) {
      return undefinedValuesAreSame;
    }
    if (!value1 || !value2) {
      return false;
    }
    const typeString1 = ObjectUtils.getTypeOf(value1);
    const typeString2 = ObjectUtils.getTypeOf(value2);
    if (typeString1 !== typeString2) {
      return false;
    }
    switch (typeString1) {
      case "AbstractModel":
        if ((value1 as AbstractApiModel).constructorName !== (value2 as AbstractApiModel).constructorName) {
          return false;
        }
        return (value1 as AbstractApiModel).isSame(value2);
      case "moment":
        return (value1 as moment.Moment).isSame(value2);
      case "duration":
        return (value1 as moment.Duration).asMilliseconds() === (value2 as moment.Duration).asMilliseconds();
      default:
        return value1 === value2;
    }
  }

  /* ContainerElement > container_element */
  public static toSnakeCase(text: string, underscore: boolean = true): string {
    let separator = "_";
    let replacedValue = /^_/;
    if (!underscore) {
      separator = "-";
      replacedValue = /^-/;
    }

    return text.replace(/(?:^|\.?)([A-Z])/g, (x, y) => separator + y.toLowerCase()).replace(replacedValue, "");
  }

  public static stringify(object: any) {
    let cache = [];
    const jsonString = JSON.stringify(object, (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (cache.indexOf(value) !== -1) {
          // Duplicate reference found, discard key
          return;
        }
        // Store value in our collection
        cache.push(value);
      }
      return value;
    });
    cache = null;
    return jsonString;
  }

  private static getJsonValue(value: any, booleanToNumber = false) {
    if (value === null || value === undefined) {
      return null;
    }
    switch (this.getTypeOf(value)) {
      case "number":
      case "string":
        return value;
      case "moment":
        return value.format();
      case "duration":
        return value.asMilliseconds();
      case "AbstractModel":
        return value.identifier;
      case "boolean":
        if (booleanToNumber) {
          return (value) ? 1 : 0;
        } else {
          return value;
        }
    }
    return value;
  }

}

