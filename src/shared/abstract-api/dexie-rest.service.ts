import {combineLatest, Observable, of, timer} from "rxjs";
import {filter, map, switchMap, take, tap} from "rxjs/operators";
import {ObjectList} from "./classes/lists";
import {AbstractApiModel} from "./classes/models";
import {AbstractApiQuery} from "./classes/services";
import {DexieService} from "./dexie";
import {ObjectUtils} from "shared/utils/object.utils";
import {ApiRequestService, RestApiTable} from "./rest/";

export class DexieRestService<T extends AbstractApiModel> extends DexieService<T> {
  public rest: RestApiTable<T> = null;

  protected pendingCreates: ObjectList<T> = new ObjectList<T>();

  protected get sourceForAll$() {
    if (this.options.synchronize) {
      return (this.rest !== null) ? this.rest.list() : of([]);
    } else {
      return (this.dexie !== null) ? this.dexie.list() : of([]);
    }
  }

  public initRest(restApiRequestService: ApiRequestService) {
    if (restApiRequestService === null) {
      return this.ready$;
    }
    this.rest = new RestApiTable<T>();
    this.rest.repository = this.repository;
    this.rest.restApiRequestService = restApiRequestService;
    return this.ready$ = combineLatest([this.ready$, this.rest.ready$]).pipe(map((results) => {
      return results.flat();
    }));
  }

  public list(query: AbstractApiQuery<T> = null): Observable<T[]> {
    if (!this.options.synchronize || this.rest === null) {
      return super.list(query);
    }
    let list$ = this.rest.list(query).pipe(
      this.defaultSort(),
      switchMap((objects: T[]) => (this.dexie !== null) ? this.dexie.postAll(objects) : of(objects)),
    );
    if (this.options.fetchAllAtOnce) {
      list$ = this.fetchAll$.pipe(take(1));
      // tslint:disable-next-line:prefer-conditional-expression
      if (this.dexie !== null) {
        list$ = list$.pipe(switchMap(() => super.list(query)));
      } else {
        list$ = list$.pipe(map((objects) => this.filterByQuery(objects, query)));
      }
    }
    return list$;
  }

  public create(object: T): Observable<T> {
    if (!this.options.synchronize) {
      return super.create(object);
    }
    this.repository.push(object);
    /* Add to PendingCreates */
    this.pendingCreates.push(object);
    const create$ = (this.dexie !== null) ? super.create(object) : of(object);
    return create$.pipe(
      /* Dont wait for rest response */
      tap(() => this.rest.create(object).pipe(
        /* Remove From PendingCreates */
        tap(() => this.pendingCreates.delete(object)),
        /* Update apiInfo in Dexie when rest response */
        switchMap(() => (this.dexie !== null) ? super.update(object) : of(object)),
      ).subscribe()),
    );
  }

  public update(object: T): Observable<T> {
    if (!this.options.synchronize) {
      return super.update(object);
    }
    this.repository.emitChange();
    /* check if waiting for a create response and wait for apiId */
    return this.isCreatedOnRest$(object).pipe(
      /* Update in Dexie emitting immediately all_.next */
      switchMap(() => (this.dexie !== null) ? super.update(object) : of(object)),
      /* Dont wait for rest response */
      tap(() => this.rest.update(object).pipe(
        /* Update apiInfo in Dexie when rest response */
        switchMap(() => (this.dexie !== null) ? super.update(object) : of(object)),
        ).subscribe(),
      ),
    );
  }

  public delete(object: T): Observable<boolean> {
    if (!this.options.synchronize) {
      return super.delete(object);
    }
    object.deleted = true;
    this.repository.delete(object);
    /* check if waiting for a create response and wait for apiId */
    /* todo: manage errors */
    return this.isCreatedOnRest$(object).pipe(
      /* update deleted true in dexie */
      switchMap(() => (this.dexie !== null) ? super.update(object) : of(object)),
      /* delete on rest */
      tap(() => this.rest.delete(object).pipe(
        /* delete on dexie */
        tap(() => (this.dexie !== null) ? super.delete(object) : of(object)),
        ).subscribe(),
      ),
      map(() => true),
    );
  }

  public getByIdentifier$(identifier: string): Observable<T> {
    return super.getByIdentifier$(identifier).pipe(
      switchMap((res) => {
        if (res === null && !this.options.fetchAllOnInit) {
          return this.list().pipe(
            map((objects: T[]) => {
              const object = objects.find((_object) => _object.hasIdentifier(identifier));
              return (!object) ? null : object;
            }),
          );
        } else {
          return of(res);
        }
      }),
    );
  }

  protected postFetchAll = (objects: T[]) => {
    if (this.dexie !== null) {
      this.dexie.postAll(objects).subscribe();
    }
  };

  /**
   * Temporary function waiting all Services use QueryObjects
   */
  protected filterByQuery(objects, query) {
    if (query !== null) {
      if (query.filter !== undefined) {
        return query.filter(objects);
      }
      timer(10).subscribe(() => {
        console.log(query);
        throw Error("Query not managed for " + this.name + " : " + ObjectUtils.stringify(ObjectUtils.requestToJson(query)));
      });
    }
    return objects;
  }

  protected isCreatedOnRest$(object: T): Observable<boolean> {
    if (this.pendingCreates.contains(object)) {
      return this.pendingCreates.change$.pipe(
        map(() => !this.pendingCreates.contains(object)),
        filter((response) => response),
        take(1),
      );
    }
    return of(true);
  }
}
