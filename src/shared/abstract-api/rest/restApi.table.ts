import {Observable} from "rxjs";
import {map, switchMap} from "rxjs/operators";
import {AbstractApiModel} from "../classes/models";
import {AbstractRepositoryService, Repository} from "../classes/services";
import {ObjectUtils} from "shared/utils/object.utils";
import {ApiRequestService} from "./apiRequest.service";

export class RestApiTable<T extends AbstractApiModel> extends AbstractRepositoryService<T> {
  public repository: Repository<T>;

  public get defaultActionRoute(): string {
    return ObjectUtils.toSnakeCase(this.repository.constructorName) + "/";
  }

  protected _restApiRequestService: ApiRequestService = null;

  public get restApiRequestService(): ApiRequestService {
    return this._restApiRequestService;
  }

  public set restApiRequestService(restApiRequestService: ApiRequestService) {
    this._restApiRequestService = restApiRequestService;
    this.ready_.next([true]);
  }

  public getById(id: number, action: string = this.defaultActionRoute): Observable<T> {
    action += id;
    return this._restApiRequestService.get(action).pipe(
      switchMap((json: any[]) => this.repository.fromJson$(json)),
    );
  }

  public create(object: T, action: string = this.defaultActionRoute): Observable<T> {
    if (object.apiId !== null) {
      return this.update(object);
    }
    return this._restApiRequestService.post(action, this.toJson(object)).pipe(
      map((json: any) => this.updateObjectWithApiJson(object, json)),
    );
  }

  public truncateTableAndCreateAll(objects: T[], action: string = this.defaultActionRoute) {
    action = action + "TRUNCATE_AND_POST_ALL";
    const jsonArray = objects.map((object) => this.toJson(object));
    return this._restApiRequestService.post(action, jsonArray).pipe(
      map((_jsonArray: any) => {
        _jsonArray.map((json, index) => {
          return this.updateObjectWithApiJson(objects[index], json);
        });
      }),
    );
  }

  public update(object: T, action: string = this.defaultActionRoute): Observable<T> {
    if (object.apiId === null) {
      return this.create(object, action);
    }
    action += object.apiId;
    return this._restApiRequestService.put(action, this.toJson(object)).pipe(
      map((json: object) => this.updateObjectWithApiJson(object, json)),
    );
  }

  public delete(object: T, action: string = this.defaultActionRoute): Observable<boolean> {
    action += object.apiId;
    return this._restApiRequestService.delete(action).pipe(
      // tap((response) => console.log(response)),
      map(() => true),
    );
  }

  public list(request: any = {}, action: string = this.defaultActionRoute): Observable<T[]> {
    return this._restApiRequestService.get(action, ObjectUtils.requestToJson(request)).pipe(
      // Converts json to Objects and Update Repository
      switchMap((jsonArray: any[]) => this.repository.fromJsonArray$(jsonArray)),
    );
  }

  protected updateObjectWithApiJson(object: T, json: object): T {
    const _object = this.repository.jsonToObject(json);
    object.apiId = _object.apiId;
    object.createdAt = _object.createdAt;
    object.updatedAt = _object.updatedAt;
    object.dirty = false;
    return object;
  }

  public toJson(object: T): any {
    const json = this.repository.toJson(object);
    /* todo: manage if still dex_XXX */
    for (const propertyName of Object.keys(json)) {
      const value = json[propertyName];
      if (propertyName !== "identifier") {
        if (ObjectUtils.isDexieIdentifier(value)) {
          alert("trying to save " + object.constructorName + " with " + propertyName + " as dexieid :" + value);
          json[propertyName] = null;
        }
        if (ObjectUtils.isApiIdentifier(value)) {
          json[propertyName] = Number(value.split("_")[1]);
        }
      }
    }
    return json;
  }
}

