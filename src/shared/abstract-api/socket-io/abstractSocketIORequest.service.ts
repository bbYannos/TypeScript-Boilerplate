import {Observable, Subject} from "rxjs/index";
import {filter, map, take} from "rxjs/internal/operators";
import SocketIOClient from "socket.io-client";
import {AbstractInitService} from "../classes/services/init.service";
import {ObjectUtils} from "shared/utils/object.utils";
import Socket = SocketIOClient.Socket;

export type SocketIORequestAction = "create" | "delete" | "update" | "list";

export class SocketIORequestData {
    public id: string = null;
    public action: SocketIORequestAction;
    public model: string;
    public data: any;
    public error: string;
}

// tslint:disable-next-line:max-classes-per-file
export class SocketIORequest extends SocketIORequestData {
    public id: string = ObjectUtils.UniqId();

    public emit$(socket, allResponses$: Observable<SocketIORequestData>): Observable<any> {
        const myResponse$ = allResponses$.pipe(
            filter((response: SocketIORequestData) => response.id === this.id),
            take(1),
            map((response: SocketIORequestData) => response.data),
        );
        socket.emit("api_request", ObjectUtils.requestToJson(this.toJson()));
        return myResponse$;
    }

    public toJson() {
        return  ObjectUtils.requestToJson(this as SocketIORequestData);
    }
}



// tslint:disable-next-line:max-classes-per-file
export abstract class AbstractSocketIORequestService extends AbstractInitService {
  public token: string | boolean = false;
  public name = "";
  public error_: Subject<any> = new Subject<any>();
  public error$: Observable<any> = this.error_.asObservable();
  protected response_: Subject<any> = new Subject<any>();
  // tslint:disable-next-line:member-ordering
  public response$ = this.response_.asObservable();

  protected abstract serverUrl;
  protected socket: Socket;

  public connect() {
      this.socket = SocketIOClient.connect("http://localhost:3000");
      this.socket.on("connection", () => {
        console.log("connection SocketIO established");
        this.ready_.next([true]);

      });
      this.socket.on("api_response", (response: SocketIORequestData) => {
          this.response_.next(response);
      });
  }

  public send(model: string, action: SocketIORequestAction, data = {}): Observable<any> {
      const params = {
          model: model,
          data: data,
          action: action,
      };
      const request = Object.assign(new SocketIORequest(), params);
      return request.emit$(this.socket, this.response$);
  }

  public create(model: string, queryData = {}): Observable<any> {
    return this.send(model, "create",  queryData);
  }

  public update(model: string, queryData = {}): Observable<any> {
    return this.send(model, "update",  queryData);
  }

  public delete(model: string, queryData = {}): Observable<any> {
    return this.send(model, "delete",  queryData);
  }
  public list(model: string, queryData = {}): Observable<any> {
    return this.send(model, "list",  queryData);
  }
}


