import {BehaviorSubject, Observable} from "rxjs";
import {filter, map, take} from "rxjs/operators";

export abstract class AbstractInitService {

  public abstract get name(): string;

  public get isReady$(): Observable<boolean> {
    return this.ready$.pipe(
      map((readies) => (readies.indexOf(false) === -1)),
      filter((ready: boolean) => ready),
      take(1),
    );
  }
  protected ready_: BehaviorSubject<boolean[]> = new BehaviorSubject<boolean[]>([false]);
  // tslint:disable-next-line:member-ordering
  public ready$ = this.ready_.asObservable();

  public init(...params) {
    this.ready_.next([true]);
  }
}
