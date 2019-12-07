import {AxiosError} from "axios";
import {BehaviorSubject, Observable, Subject, throwError} from "rxjs";
import {catchError, filter, switchMap, take, tap} from "rxjs/operators";
import {API_METHODS, ApiRequest} from "./apiRequest.model";

export {ApiRequest, API_METHODS};

export class ApiRequestService {
  public token: string | boolean = false;
  public apiEndpointUrl = null;
  public authEndPoint = null;
  public apiLoading_: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readyToSendNext$ = this.apiLoading_.asObservable().pipe(filter((loading: boolean) => loading === false));
  public error_: Subject<AxiosError> = new Subject<AxiosError>();
  protected currentRequestIdentifier: string = null;

  protected queue: ApiRequest[] = [];

  public get<T>(action: string, params = {}): Observable<T> {
    return this.addRequest(action, API_METHODS.GET, params);
  }

  public put<T>(action: string, object = {}): Observable<T> {
    return this.addRequest(action, API_METHODS.PUT, object);
  }

  public delete<T>(action: string, params = null): Observable<T> {
    return this.addRequest(action, API_METHODS.DELETE, params);
  }

  public post<T>(action: string, object: any = {}, extraParams: any = {}): Observable<T> {
    // tslint:disable-next-line:prefer-object-spread
    const params = Object.assign(extraParams, object);
    return this.addRequest(action, API_METHODS.POST, params);
  }

  public addRequest<T>(action: string, method: string, params: any = null): Observable<T> {
    const url = this.apiEndpointUrl + action;
    return this.addRequestWithFullUrl(url, method, params);
  }

  /* Different EndPoint for Authentication **/
  public addRequestWithFullUrl<T>(url: string, method: string, params: any = null): Observable<T> {
    const request = new ApiRequest();
    request.url = url;
    request.method = method;
    request.params = params;
    if (this.token) {
      request.token = this.token as string;
    }
    const identifier = request.url + request.method + JSON.stringify(request.params);
    return this.readyToSendNext$.pipe(
      // take place in queue: I hope it is the latest
      filter(() => {
        if (this.currentRequestIdentifier === null) {
          this.currentRequestIdentifier = identifier;
          return true;
        }
        return false;
      }),
      take(1),
      switchMap(() => {
        this.apiLoading_.next(true);
        return request.execute().pipe(
          tap(() => {
            this.currentRequestIdentifier = null;
            this.apiLoading_.next(false);
          }),
          catchError((error) => {
            this.currentRequestIdentifier = null;
            this.apiLoading_.next(false);
            this.error_.next(error);
            return throwError(error);
          }),
        );
      }),
    );
  }
}


