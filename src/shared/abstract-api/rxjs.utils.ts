import {BehaviorSubject, combineLatest, from, Observable, of, throwError, timer} from "rxjs";
import {auditTime, map, share, switchMap, take} from "rxjs/operators";

export class RxjsUtils {
  public static promiseToObservable<T>(promise: Promise<T>): Observable<T> {
    const error_: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    const response = from(promise.catch((error: any) => {
      timer(0).subscribe(() => {
        throw error;
      });
      error_.next(error.response);
    }));
    return combineLatest([response, error_]).pipe(
      take(1),
      switchMap(([_response, error]) => (_response) ? of(_response) : throwError(error)),
      share(),
    );
  }



  public static combineLatest(obs$: Array<Observable<any>>, emptyValue = []): Observable<any[]> {
    if (obs$.length === 0) {
      return of(emptyValue);
    }
    return combineLatest(obs$).pipe(
      auditTime(10),
    );
  }

  public static combineAndFlat(ob$: Array<Observable<any>>) {
    return this.combineLatest(ob$).pipe(
      map((res: any[][]) => res.flat()),
    );
  }

  /**
   * do not use of or from if possibly null
   * ie : UserService.tryToConnectWithStoredUser$()
   * after ...fromJson$(json)...
   * UserService response_ does not emit next value
   */
  public static of<T>(value: T): Observable<T> {
    return timer(0).pipe(map(() => value));
  }
}
