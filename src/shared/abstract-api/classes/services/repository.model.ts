import _ from "lodash";
import {combineLatest, Observable} from "rxjs";
import {debounceTime, tap} from "rxjs/operators";
import {JsonMapper} from "shared/json2typescript";
import moment from "shared/moment/moment";
import {RxjsUtils} from "../../rxjs.utils";
import {ObjectList} from "../lists";
import {AbstractApiModel} from "../models";
import {ChildrenListDefinition} from "../relations/children-list.definition";

export interface RelationManagerInterface<T extends AbstractApiModel> {
  childrenListDefinitions: Array<ChildrenListDefinition<T, any>>;
  manageForeignRelations(object: T, json: any): void;
  rollbackForeignRelations(object: T): void;
  fetchForeign$(object: T, json: any): Observable<T>;
}

export abstract class AbstractRepository<T extends AbstractApiModel> extends ObjectList<T> {
  public abstract constructorFn: new (...params) => T;
  public relationManager: RelationManagerInterface<T> = null;
  public debug = false;
  public perfDebug = false;
  public checkExisting = true;

  protected jsonMapper = new JsonMapper<T>();

  public get constructorName(): string {
    return  new this.constructorFn(true).constructorName;
  }

  public makeNew(): T {
    const object = new  this.constructorFn(true);
    object.createdAt = moment();
    this.relationManager.manageForeignRelations(object, null);
    this.push(object);
    return object;
  }

  public fromJsonArray$(jsonArray: any[]): Observable<T[]> {
    this.perfLog("fromJsonArray$ " + this.constructorName + " START");
    const startTime = moment();
    if (jsonArray.length === 0) {
      return  RxjsUtils.of([]);
    }
    const objects$ = jsonArray.map((json: any) => this.fromJson$(json));
    return combineLatest(objects$).pipe(
      debounceTime(50),
      tap(() => this.perfLog("fromJsonArray$ " + this.constructorName + " time : " + moment().diff(startTime))),
    );
  }

  /**
   * Create object from json and ADD IT IN REPOSITORY !
   */
  public fromJson$(json: any): Observable<T> {
    this.log("fromJson$, passed JSON " + this.constructorName, json);
    let object = null;
    /* search if identifier exits in repository */
    if (this.checkExisting) {
      object = this.getByJson(json);
    }
    if (object !== null) {
      this.log("object found");
      this.relationManager.rollbackForeignRelations(object);
      this.jsonMapper.updateFromJson(json, object);
    } else {
      object = this.jsonMapper.createFromJson(json, this.constructorFn);
      this.push(object);
    }

    this.log("Before fetch foreign " + this.constructorName);
    this.log("-- Object ", object);
    this.log("-- Json ", json);
    this.relationManager.manageForeignRelations(object, json);
    return this.relationManager.fetchForeign$(object, json).pipe(
      tap(() => this.constructorName + "Fetch FOREIGN DONE"),
    );
  }

  /**
   * Simply create object from json
   * DOES NOT ADD IT IN REPOSITORY
   * Permits the creation of temporary object, to compare difference etc...
   */
  public jsonToObject(json: any): T {
    return this.jsonMapper.createFromJson(json, this.constructorFn);
  }

  public toJson(object: T) {
    return this.jsonMapper.toJson(object);
  }

  public changed(object1: T, object2: T): boolean {
    return (_.isEqual(this.jsonMapper.toJson(object1), this.jsonMapper.toJson(object2)));
  }

  public getById(id: number): T {
    return this.getByJson({id: id});
  }

  public getByJson(json): T {
    const tempObj: T = this.jsonToObject(json);
    const result = this._objects.find((_object: T) => _object.isSame(tempObj));
    return (result) ? result : null;
  }

  public log(...param) {
    if (this.debug) {
      console.log(...param);
    }
  }
  public perfLog(...param) {
    if (this.perfDebug) {
      console.log(...param);
    }
  }
}

// tslint:disable-next-line:max-classes-per-file
export class Repository<T extends AbstractApiModel> extends AbstractRepository<T> {
  // noinspection JSUnusedGlobalSymbols
  constructor(public constructorFn: new () => T) {
    super();
  }
}
