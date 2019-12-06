import {Observable} from "rxjs";
import {AbstractApiModel} from "../classes/models";
import {AbstractRepositoryService} from "../classes/services/repository-service.model";
import {AbstractRepository} from "../classes/services/repository.model";
import {DexieService} from "../dexie";
import {AbstractSocketIORequestService} from "./abstractSocketIORequest.service";
import {SocketIoTable} from "./socket-io.table";


export class SocketIoService<T extends AbstractApiModel> extends AbstractRepositoryService<T> {
    public repository: AbstractRepository<T>;
    public socketIo: SocketIoTable<T>;

    public init(socketIoRequestService: AbstractSocketIORequestService): Observable<boolean[]> {
        this.socketIo = new SocketIoTable(socketIoRequestService, this.repository);
        return this.ready$;
    }

    public create(object: T): Observable<T> {
        return undefined;
    }
    public delete(object: T): Observable<boolean> {
        return undefined;
    }
    public update(object: T, ...params): Observable<T> {
        return undefined;
    }

    public list(request: any): Observable<T[]> {
        return undefined;
    }
}

// tslint:disable-next-line:max-classes-per-file
export class AbstractSocketIoDexieService<T extends AbstractApiModel> extends DexieService<T> {
    public repository: AbstractRepository<T>;
    public socketIo: SocketIoTable<T>;

    /*
    public init(dexieDatabase: DexieRequestService, socketIoRequestService: AbstractSocketIORequestService) {
        this.socketIo = new SocketIoTable(socketIoRequestService, this.repository);
        super.init(dexieDatabase);
    }
    */
    public dexieToServer() {
        this.socketIo.list({}).subscribe((objects: T[]) => {
           console.log(objects);
        });
    }
}
