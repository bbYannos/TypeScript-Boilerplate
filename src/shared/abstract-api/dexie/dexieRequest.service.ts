import Dexie from "dexie/dist/dexie";
import {forkJoin, from, Observable} from "rxjs";
import {catchError, map, mergeMap, shareReplay, switchMap, tap} from "rxjs/operators";
import {AbstractInitService} from "../classes/services";
import {RxjsUtils} from "../rxjs.utils";

export abstract class DexieRequestServiceConnexion extends AbstractInitService {

  public get offlineDbName() {
    return this._dbName + "2";
  }

  public get onlineDbName() {
    return this._dbName;
  }

  public get dbName(): string {
    if (!this.connected) {
      return this.offlineDbName;
    }
    return this.onlineDbName;
  }

  protected abstract stores: any;
  protected version: number = 1;

  protected abstract _dbName: string;

  constructor(protected connected: boolean) {
    super();
  }

  public db$(): Observable<Dexie> {
    // do not use "dexie" witch import dexie.es.js
    // when "dexie-export-import" use dexie.js
    return from(import(/* webpackChunkName: "dexie" */  "dexie/dist/dexie.js")).pipe(
      map((dexieModule) => new dexieModule.default(this.dbName)),
      shareReplay(1),
    );
  }

  public importExport$(): Observable<any> {
    return from(import(/* webpackChunkName: "dexie-export-import" */  "dexie-export-import")).pipe(
      map((module) => module.default),
      shareReplay(1),
    );
  }

  public init() {
    let init$ = this.db$();
    if (this.connected) {
      init$ = init$.pipe(
        switchMap(() => this.deleteDb()),
      );
    }
    init$.pipe(
      switchMap(() => this.createDbIfNeeded()),
    ).subscribe(() => {
      this.ready_.next([true]);
    });
  }

  public getTable$<T>(tableName: string): Observable<Dexie.Table<T, number>> {
    return this.isReady$.pipe(mergeMap(() =>
      this.db$().pipe(map((db: Dexie) => db[tableName])),
    ));
  }

  public deleteDb(): Observable<Dexie> {
    return this.db$().pipe(
      tap((db: Dexie) => db.close()),
      switchMap((db: Dexie) => from(db.delete()).pipe(map(() => db))),
    );
  }

  public exportDb() {
    return forkJoin([this.db$(), this.importExport$()]).pipe(
      switchMap(([db, eiModule]) =>
        from(eiModule.exportDB(db, {prettyJson: true})),
      ));
  }

  public importDb(file) {
    return this.db$().pipe(
      switchMap(() => this.deleteDb()),
      switchMap(() => this.createDbIfNeeded()),
      switchMap(() => forkJoin([this.db$(), this.importExport$()])),
      switchMap(([db, eiModule]) => from(eiModule.importInto(db, file))),
    );
  }

  protected createDbIfNeeded() {
    return this.db$().pipe(switchMap((db: Dexie) =>
      RxjsUtils.promiseToObservable(db.open()).pipe(
        catchError(() => {
          db.version(this.version).stores(this.stores);
          return RxjsUtils.promiseToObservable(db.open());
        }),
      ),
    ));
  }
}

// tslint:disable-next-line:max-classes-per-file
export abstract class DexieRequestService extends DexieRequestServiceConnexion {

  public postAll<T>(jsonArray: any[], tableName: string): Observable<any[]> {
    const results$: any[] = jsonArray.map((json) => this.post(json, tableName));
    return forkJoin(results$);
  }

  public post(json: object, tableName: string): Observable<number> {
    return this.getTable$(tableName).pipe(
      switchMap((table: Dexie.Table<any, number>) =>
        RxjsUtils.promiseToObservable(table.put(json)),
      ),
    );
  }

  /**
   * The difference between put() and post() is that put() will only apply given
   * changes to the object while post() will replace the entire object.
   * Another difference is that in case key is not found, post() would create a new object while
   * put() wont change anything.
   * The returned Promise will NOT fail if key was not found but resolve with value 0 instead of 1.
   */
  public put(dexieId: number, json: object, tableName: string): Observable<boolean> {
    return this.getTable$(tableName).pipe(
      switchMap((table: Dexie.Table<any, number>) =>
        RxjsUtils.promiseToObservable(table.update(dexieId, json)),
      ),
      map((zeroOrOne: number) => zeroOrOne > 0),
    );
  }

  public getAll(tableName: string): Observable<any[]> {
    return this.list(null, tableName);
  }

  public deleteAll(jsonArray: object[], tableName: string): Observable<any[]> {
    const results$: any[] = jsonArray.map((json) => this.delete((json as any).dexieId, tableName));
    return forkJoin(results$);
  }

  public delete(dexieId: number, tableName: string): Observable<any> {
    return this.getTable$(tableName).pipe(
      switchMap((table: Dexie.Table<any, number>) => table.delete(dexieId)),
    );
  }

  public list(where: any = null, tableName: string): Observable<any> {
    let dexieCollection: Dexie.Collection<any, number> = null;
    return this.getTable$(tableName).pipe(
      switchMap((table: Dexie.Table<any, number>) => {
        // tslint:disable-next-line:prefer-conditional-expression
        if (where !== null) {
          dexieCollection = table.where(where) as any;
        } else {
          dexieCollection = table.toCollection();
        }
        return RxjsUtils.promiseToObservable(dexieCollection.toArray());
      }),
    );
  }
}


