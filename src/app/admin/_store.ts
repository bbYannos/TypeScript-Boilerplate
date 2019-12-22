import {Formation} from "modules/Api/Model/Formation";
import {Speaker} from "modules/Api/Model/Speaker";
import {Trainee} from "modules/Api/Model/Trainee";
import {BehaviorSubject} from "rxjs";

export class Store {
  public static formation_: BehaviorSubject<Formation> = new BehaviorSubject<Formation>(null);
  public static trainee_: BehaviorSubject<Trainee> = new BehaviorSubject<Trainee>(null);
  public static speaker_: BehaviorSubject<Speaker> = new BehaviorSubject<Speaker>(null);
}
