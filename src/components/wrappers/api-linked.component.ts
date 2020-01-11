import {Observable, of} from "rxjs";
import {AbstractApiModel} from "shared/abstract-api/classes/models";
import {AbstractRepositoryService} from "shared/abstract-api/classes/services";
import {GenericComponent} from "./generic.component";

export class ApiLinkedComponent<T extends AbstractApiModel> extends GenericComponent {
  protected service: AbstractRepositoryService<T> = null;

  public createAction: () => Observable<T> = () => {
    if (this.service !== null) {
      return this.service.create(this.service.repository.makeNew());
    }
    return of(null);
  };

  public deleteAction: (object: T) => Observable<boolean> = (object: T) => {
    if (this.service !== null) {
      return this.service.delete(object);
    }
    return of(false);
  };

  public updateAction: (object: T) => Observable<T> = (object: T) => {
    if (this.service !== null) {
      return this.service.update(object);
    }
    return of(object);
  };

  public editAction: (object: T) => void = (object: T) => {
    return;
  };
}
