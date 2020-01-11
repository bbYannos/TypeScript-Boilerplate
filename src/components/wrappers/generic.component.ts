import {BehaviorSubject, Observable} from "rxjs";

export class GenericComponent {

  public loading_: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(public $htmEl: HTMLElement, public close$: Observable<any>) {
  }
}
