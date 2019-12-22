import {Observable} from "rxjs";
import {AbstractRepositoryService} from "../../../shared/abstract-api/classes/services";
import {EventInterface} from "./Event.Interface";
export interface EventSourceInterface<T> extends AbstractRepositoryService<any> {
  createByQuery(request): Observable<T>;

  update(object: EventInterface): Observable<T>;

  delete(object: T): Observable<boolean>;
}
