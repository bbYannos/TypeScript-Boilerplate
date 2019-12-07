import {AxiosError} from "axios";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {AbstractApiModel} from "../classes/models";
import {AbstractRepositoryService, Repository} from "../classes/services";

export interface InterfaceApiRequestService {
  token: string | boolean;
  apiLoading_: BehaviorSubject<boolean>;
  readyToSendNext$;
  error_: Subject<AxiosError>;
  get<T>(action: string, params): Observable<T>;

  put<T>(action: string, object): Observable<T>;

  delete<T>(action: string, params): Observable<T>;

  post<T>(action: string, object: any, extraParams: any): Observable<T>;

  addRequest<T>(action: string, method: string, params: any): Observable<T>;

  addRequestWithFullUrl<T>(url: string, method: string, params: any): Observable<T>;
}

export interface InterfaceRestApiTable<T extends AbstractApiModel> extends AbstractRepositoryService<T> {
  repository: Repository<T>;
  readonly defaultActionRoute: string;

  restApiRequestService: InterfaceApiRequestService;

  getById(id: number, action?: string): Observable<T>;

  create(object: T, action?: string): Observable<T>;

  truncateTableAndCreateAll(objects: T[], action: string): Observable<void>;

  update(object: T, action?: string): Observable<T>;

  delete(object: T, action?: string): Observable<boolean>;

  list(request?: any, action?: string): Observable<T[]>;
}
