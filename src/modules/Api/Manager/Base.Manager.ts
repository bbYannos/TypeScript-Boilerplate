import {AbstractInitService} from "shared/abstract-api";
import "../RelationManager";
import {LoginManager} from "./Login.Manager";

export class BaseApiManager extends LoginManager {

  public static get services(): AbstractInitService[] {
    return [];
  }
}
