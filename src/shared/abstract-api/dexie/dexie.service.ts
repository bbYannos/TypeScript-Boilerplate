import {combineLatest, Observable, of} from "rxjs";
import {map, switchMap, take, tap} from "rxjs/operators";
import {AbstractApiModel} from "../classes/models";
import {AbstractRepositoryService} from "../classes/services/repository-service.model";
import {AbstractRepository} from "../classes/services/repository.model";
import {DexieTable} from "./dexie.table";
import {DexieRequestService} from "./dexieRequest.service";


export class DexieService<T extends AbstractApiModel> extends AbstractRepositoryService<T> {
  public repository: AbstractRepository<T> = null;
  public dexie: DexieTable<T> = null;
  protected postFetchAll: (objects: T[]) => void = null;

  /**
   * Used in case of option.fetchAllAtOnce and populate Repository in one request
   * Repository should self manage checkExisting and other stuff
   */
  protected _fetchAll$: Observable<T[]> = this.isReady$.pipe(
    // disable checkExisting for performance purpose
    tap(() => this.repository.checkExisting = false),
    switchMap(() => this.sourceForAll$),
    tap((objects) => {
      this.repository.log("REPOSITORY FILLED FROM FETCH ALL" + this.name);
      this.repository.checkExisting = true;
      this.repository.populated = true;
      this.repository.emitChange();
      if (this.postFetchAll !== null) {
        this.postFetchAll(objects);
      }
    }),
  );

  /**
   * Getting repository change$ call repository source$ aka this._fetchAll$
   * Request is launched and repository change$ will start Emit
   */
  public get fetchAll$(): Observable<T[]> {
    return this.isReady$.pipe(
      // tap(() => console.log(this.name + " is ready")),
      switchMap(() => this.repository.change$.pipe(
        this.defaultSort(),
      )),
    );
  }

  protected get sourceForAll$() {
    return (this.dexie !== null) ? this.dexie.list() : of([]);
  }

  public init() {
    if (this.options.fetchAllAtOnce) {
      this.repository.source$ = this._fetchAll$;
    }

    let init$ = of(true) as Observable<any>;
    if (this.options.fetchAllOnInit && this.options.fetchAllAtOnce) {
      init$ = this.repository.change$.pipe(take(1));
    }
    init$.subscribe(() => {
      this.ready_.next([true]);
    });
  }

  public initDexie(dexieDatabase: DexieRequestService) {
    if (dexieDatabase === null) {
      return this.ready$;
    }
    this.dexie = new DexieTable<T>();
    this.dexie.repository = this.repository;
    this.dexie.dexieDataBase = dexieDatabase;
    return this.ready$ = combineLatest([this.ready$, this.dexie.ready$]).pipe(map((results) => results.flat()));
  }

  public update(object: T): Observable<T> {
    return this.dexie.update(object).pipe(
      tap(() => this.repository.emitChange()),
    );
  }

  public create(object: T): Observable<T> {
    this.repository.push(object);
    return this.dexie.create(object).pipe(
      tap(() => this.repository.emitChange()),
    );
  }

  public delete(object: T): Observable<boolean> {
    object.deleted = true;
    this.repository.delete(object);
    return this.dexie.delete(object).pipe(
      tap(() => this.repository.emitChange()),
    );
  }

  public list(request: any = {}): Observable<T[]> {
    if (this.dexie === null) {
      /* todo: Request on repository or check if id is present and get by id*/
      console.log("Dexie is NULL !!!");
      return of([]);
    }
    return this.dexie.list(request).pipe(
      tap(() => this.repository.emitChange()),
    );
  }

  public excludeDeleted(result$: Observable<T[]>): Observable<T[]> {
    return result$.pipe(
      map((objects: T[]) => objects.filter((object: T) => !object.deleted)),
    );
  }

  public getByIdentifier$(identifier: string): Observable<T> {
    if (this.dexie === null) {
      return super.getByIdentifier$(identifier);
    }
    return this.isReady$.pipe(map(() => {
      // console.log("SERVICE SAYS IS READY : ", this.name);
      return this.repository.getByIdentifier(identifier);
    }));
  }
}
