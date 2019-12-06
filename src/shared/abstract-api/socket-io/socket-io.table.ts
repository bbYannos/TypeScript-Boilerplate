import {Observable} from "rxjs";
import {switchMap} from "rxjs/operators";
import {AbstractApiModel} from "../classes/models";
import {AbstractRepository} from "../classes/services/repository.model";
import {ObjectUtils} from "../object.utils";
import {AbstractSocketIORequestService} from "./abstractSocketIORequest.service";

export class SocketIoTable<T extends AbstractApiModel> {

  public model: string;

  constructor(
    public socketIORequestService: AbstractSocketIORequestService,
    public repository: AbstractRepository<T>,
  ) {
    this.model = new this.repository.constructorFn().constructorName;
  }


  public create(object: T): Observable<T> {
    return this.socketIORequestService
    .send(this.model, "create", ObjectUtils.objectToJson(object)).pipe(
      switchMap(
        (json) => {
          json.identifier = object.identifier;
          return this.repository.fromJson$(json);
        },
      ),
    );
  }

  public update(object: T): Observable<T> {
    return this.socketIORequestService
    .send(this.model, "update", ObjectUtils.objectToJson(object)).pipe(
      switchMap(
        (json) => {
          json.identifier = object.identifier;
          return this.repository.fromJson$(json);
        },
      ),
    );
  }

  public delete(object: T): Observable<T> {
    return this.socketIORequestService
    .send(this.model, "delete", ObjectUtils.objectToJson(object)).pipe(
      switchMap(
        (json) => {
          json.identifier = object.identifier;
          return this.repository.fromJson$(json);
        },
      ),
    );
  }

  public list(queryData = {}): Observable<T[]> {
    return this.socketIORequestService
    .send(this.model, "list", ObjectUtils.objectToJson(queryData)).pipe(
      switchMap(
        (jsonArray) => {
          console.log(jsonArray);
          return this.repository.fromJsonArray$([]);
        },
      ),
    );
  }

}
