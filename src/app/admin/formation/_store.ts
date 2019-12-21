import {Formation} from "modules/Api/Model/Formation";
import {BehaviorSubject} from "rxjs";

export class Store {
  public static formation_: BehaviorSubject<Formation> = new BehaviorSubject<Formation>(null);
}
