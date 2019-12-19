import {Formation} from "modules/Api/Model/Formation";
import {BehaviorSubject, Subject} from "rxjs";

export class Store {
  public static formation_: BehaviorSubject<Formation> = new BehaviorSubject<Formation>(null);
}
