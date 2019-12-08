import {Observable, of, pipe} from "rxjs";
import {map} from "rxjs/operators";
import {RxjsUtils} from "../../rxjs.utils";
import {ServiceFactory} from "../../service.factory";
import {AbstractApiModel} from "../models";
import {AbstractInitService} from "./init.service";
import {AbstractRepositoryServiceOptions} from "./repository-service.options";
import {AbstractRepository} from "./repository.model";
import {AbstractApiQuery} from "./repository.query";

export abstract class AbstractRepositoryService<T extends AbstractApiModel> extends AbstractInitService {
  public abstract repository: AbstractRepository<T>;
  public options: AbstractRepositoryServiceOptions = new AbstractRepositoryServiceOptions();

  public rest: any = null;
  public dexie: any = null;

  public get name(): string {
    return this.repository.constructorName;
  }

  public defaultSort = () => pipe(map((objects: T[]) =>
    objects.sort((object1, object2) => (object1.apiId > object2.apiId) ? 1 : -1)),
  );

  public getById(id: number): Observable<T> {
    return of(this.repository.getById(id));
  }

  public getByIdentifier(identifier: string): T {
    return this.repository.getByIdentifier(identifier);
  }

  public getByIdentifier$(identifier: string): Observable<T> {
    return RxjsUtils.of(this.repository.getByIdentifier(identifier));
  }

  public filter(objects$: Observable<T[]>, request: AbstractApiQuery<T>) {
    return objects$.pipe(
      map((objects) => objects.filter((object) => request.test(object))),
    );
  }

  public abstract create(object: T): Observable<T>;

  public abstract update(object: T, ...params): Observable<T>;

  public abstract delete(object: T): Observable<boolean>;

  public abstract list(request: any): Observable<T[]>;
}
