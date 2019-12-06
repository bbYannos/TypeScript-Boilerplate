import Dexie from "dexie";
import {Observable, of} from "rxjs";
import {map, switchMap} from "rxjs/operators";
import {AbstractApiModel} from "../classes/models";
import {AbstractRepositoryService} from "../classes/services/repository-service.model";
import {AbstractRepository} from "../classes/services/repository.model";
import {ObjectUtils} from "../object.utils";
import {DexieRequestService} from "./dexieRequest.service";

/**
 * CRUD Objects on Dexie DataBase
 * Needs DexieDataBase
 * Needs ObjectRepository for Json operations and TableName
 * Delete directly in Repository
 * Simple List - Does not need Request Object
 */
export class DexieTable<T extends AbstractApiModel> extends AbstractRepositoryService<T> {
  public repository: AbstractRepository<T> = null;

  protected _dexieDataBase: DexieRequestService = null;

  public get dexieDataBase() {
    if (this._dexieDataBase === null) {
      console.log("Dexie Database not set for " + this.tableName);
    }
    return this._dexieDataBase;
  }

  public set dexieDataBase(dexieDataBase: DexieRequestService) {
    this._dexieDataBase = dexieDataBase;
    this.ready_.next([true]);
  }

  public get table$(): Observable<Dexie.Table<T, number>> {
    return this.dexieDataBase.getTable$(this.tableName);
  }

  public get tableName(): string {
    return ObjectUtils.toSnakeCase(this.repository.constructorName);
  }

  public getAll(): Observable<T[]> {
    return this.list();
  }

  public postAll(objects: T[]): Observable<T[]> {
    if (objects.length === 0) {
      return of(objects);
    }
    return this.createAll(objects);
  }

  /* Admin Layout purpose */
  public getAllJsons(): Observable<any[]> {
    return this.dexieDataBase.getAll(this.tableName);
  }

  public postAllJsons(jsonArray: any[]) {
    return this.dexieDataBase.postAll(jsonArray, this.tableName);
  }

  public deleteAll(objects: T[]): Observable<boolean[]> {
    const jsonArray = objects.map((object) => this.repository.toJson(object));
    return this.dexieDataBase.deleteAll(jsonArray, this.tableName);
  }

  public create(object: T): Observable<T> {
    return this.dexieDataBase.post(this.repository.toJson(object), this.tableName).pipe(
      map((dexieId: number) => {
        object.dexieId = dexieId;
        return object;
      }),
    );
  }

  public createAll(objects: T[]): Observable<T[]> {
    const jsonArray = objects.map((object: T, index) => {
      object.dexieId = index + 1;
      return this.repository.toJson(object);
    });
    return this.dexieDataBase.postAll(jsonArray, this.tableName).pipe(
      map(() => objects),
    );
  }

  public update(object: T, values: object = null): Observable<T> {
    if (values === null) {
      return this.dexieDataBase.post(this.repository.toJson(object), this.tableName).pipe(
        map(() => object),
      );
    }
    return this.dexieDataBase.put(object.dexieId, values, this.tableName).pipe(
      map(() => object),
    );
  }

  public delete(object: T): Observable<boolean> {
    return this.dexieDataBase.delete(object.dexieId, this.tableName);
  }

  public list(request: any = null): Observable<T[]> {
    const where = ObjectUtils.requestToJson(request, true);
    /*!!!! ugly quick fix avoiding equals in trainings where !!!*/
    // todo: real requestToWhere in AbstractApiRequest
    if (where) {
      delete (where as any).equals;
    }
    /*!!!! ugly quick fix avoiding equals in trainings where*/

    return this.dexieDataBase.list(where, this.tableName).pipe(
      switchMap((jsonArray: any[]) => this.repository.fromJsonArray$(jsonArray)),
    );
  }

  public getById(dexieId: number): Observable<T> {
    const request = {dexieId};
    return this.list(request).pipe(
      map((objects: T[]) => (objects.length) ? objects.shift() : null),
    );
  }
}
