import {BooleanConverter, JsonObject, JsonProperty} from "shared/json2typescript";
import {ObjectUtils} from "../../object.utils";

@JsonObject("AbstractIdentifiedObject")
export abstract class AbstractIdentifiedObject {

  public abstract constructorName: string;

  @JsonProperty("dirty", BooleanConverter, true)
  public dirty: boolean = false;

  @JsonProperty("deleted", BooleanConverter, true)
  public deleted: boolean = false;

  @JsonProperty("dexieId", Number, true)
  public dexieId: number = null;

  @JsonProperty("id", Number, true)
  public apiId: number = null;

  public set id(id: number) {
    this.apiId = id;
  }

  @JsonProperty("identifier", String, true)
  protected _identifier: string = ObjectUtils.UniqId();

  /**
   * Returns api_{id} (saved on APi) > dexie_{id} (saved on Dexie) > UniqId (Not saved)
   */
  public get identifier(): string {
    return this.identifiers.filter((identifier) => (identifier !== null)).shift();
  }

  public set identifier(identifier: string) {
    this._identifier = identifier;
  }

  public get identifiers(): string[] {
    return [this.apiIdentifier(), this.dexieIdentifier(), this._identifier];
  }

  public dexieIdentifier = () => (this.dexieId !== null) ? ObjectUtils.dexPrefix + this.dexieId : null;

  public apiIdentifier = () => (this.apiId !== null) ? ObjectUtils.apiPrefix + this.apiId : null;

  public hasIdentifier(identifier: string): boolean {
    if (identifier === null || identifier === undefined) {
      return false;
    }
    return (this.identifiers.filter(
        (_identifier) => (_identifier !== undefined && _identifier !== null)).indexOf(identifier) > -1
    );
  }

  public isSame(object: AbstractIdentifiedObject): boolean {
    if (object === null) {
      return false;
    }
    return object.identifiers.some((identifier: string) => {
      return this.hasIdentifier(identifier);
    });
  }
}
