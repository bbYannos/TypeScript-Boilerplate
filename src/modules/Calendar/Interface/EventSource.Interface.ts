import {Observable} from "rxjs";
import {EventInterface} from "./Event.Interface";
export interface EventSourceInterface<T extends EventInterface> {
  createByQuery(request): Observable<T>;

  update(object: EventInterface): Observable<T>;

  delete(object: T): Observable<boolean>;
}
