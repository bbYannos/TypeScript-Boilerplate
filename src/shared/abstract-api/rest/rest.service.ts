import {combineLatest, Observable} from "rxjs";
import {filter, map, shareReplay, switchMap, take, tap} from "rxjs/operators";
import {ObjectList} from "../classes/lists";
import {AbstractApiModel} from "../classes/models";
import {AbstractRepository, AbstractRepositoryService} from "../classes/services";
import {ApiRequestService} from "./apiRequest.service";
import {RestApiTable} from "./restApi.table";

export class RestService<T extends AbstractApiModel> extends AbstractRepositoryService<T> {
  public repository: AbstractRepository<T> = null;
  public rest: RestApiTable<T> = null;

  protected pendingCreates: ObjectList<T> = new ObjectList<T>();
  protected fetchAll$ = null;

  // noinspection JSUnusedGlobalSymbols
  public initRest(restApiRequestService: ApiRequestService) {
    if (restApiRequestService === null) {
      return this.ready$;
    }
    /* todo: share with DexieRestService */
    this.rest = new RestApiTable<T>();
    this.rest.repository = this.repository;
    this.rest.restApiRequestService = restApiRequestService;
    this.fetchAll$ = this.isReady$.pipe(
      tap(() => this.repository.checkExisting = false),
      switchMap(() => this.rest.list()),
      tap(() => this.repository.checkExisting = true),
      shareReplay(1),
    );
    return this.ready$ = combineLatest([this.ready$, this.rest.ready$]).pipe(map((results) => {
      return results.flat();
    }));
  }

  public getById(id: number): Observable<T> {
    return this.rest.getById(id);
  }

  public create(object: T): Observable<T> {
    this.repository.push(object);
    /* Add to PendingCreates */
    this.pendingCreates.push(object);
    return this.rest.create(object).pipe(
      /* Remove From PendingCreates */
      tap(() => this.pendingCreates.delete(object)),
    );
  }

  public update(object: T): Observable<T> {
    this.repository.emitChange();
    return this.isCreatedOnRest$(object).pipe(
      switchMap(() => this.rest.update(object)),
    );
  }

  public delete(object: T): Observable<boolean> {
    object.deleted = true;
    return this.update(object).pipe(map(() => true));
  }

  public list(request: any): Observable<T[]> {
    return this.rest.list(request);
  }

  protected isCreatedOnRest$(object: T): Observable<boolean> {
    return this.pendingCreates.change$.pipe(
      map(() => !this.pendingCreates.contains(object)),
      filter((response) => response),
      take(1),
    );
  }
}
