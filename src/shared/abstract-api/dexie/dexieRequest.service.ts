import Dexie from "dexie";
import {exportDB, importInto} from "dexie-export-import";
import {forkJoin, from, Observable, Subject} from "rxjs";
import {map, switchMap} from "rxjs/operators";
import {AbstractInitService} from "../classes/services";
import {RxjsUtils} from "../rxjs.utils";

export abstract class DexieRequestServiceConnexion extends AbstractInitService {

  public get dbName(): string {
    if (!this.connected) {
      return this.offlineDbName;
    }
    return this.onlineDbName;
  }

  public get db(): Dexie {
    if (this._db === null) {
      this._db = new Dexie(this.dbName);
    }
    return this._db;
  }

  public get offlineDbName() {
    return this._dbName + "2";
  }

  public get onlineDbName() {
    return this._dbName;
  }

  public get exists$(): Observable<boolean> {
    return from(Dexie.exists(this.dbName));
  }
  protected abstract stores: any;
  protected version: number = 1;

  protected abstract _dbName: string;

  protected _db: Dexie = null;

  constructor(protected connected: boolean) {
    super();
  }

  public init() {
    this.db.close();
    if (this.connected) {
      this.resetDb().subscribe();
    } else {
      this.createDbIfNeeded().subscribe();
    }
  }

  public getTable$<T>(tableName: string): Observable<Dexie.Table<T, number>> {
    return this.isReady$.pipe(map(() => this.db[tableName]));
  }

  public resetDb(): Observable<any> {
    this._db.close();
    return from(Dexie.delete(this.dbName)).pipe(
      switchMap(() => this.createDbIfNeeded()),
    );
  }

  public exportDb() {
    return from(exportDB(this._db, {prettyJson: true}));
  }

  public importDb(file) {
    const response_ = new Subject<void>();
    this.resetDb().subscribe(() => {
      importInto(this._db, file).finally(() => {
        response_.next();
      });
    });
    return response_.asObservable();
  }

  protected createDbIfNeeded() {
    return this.exists$.pipe(
      map(() => {
        this._db = new Dexie(this.dbName);
        this._db.version(this.version).stores(this.stores);
        this._db.open();
        this.ready_.next([true]);
        return true;
      }),
    );
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


