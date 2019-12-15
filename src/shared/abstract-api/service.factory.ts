import {DexieRequestService, DexieTable} from "./dexie";
import {ApiRequestService, RestApiTable} from "./rest";

interface Service {
  dexie: DexieTable<any>;
  rest: RestApiTable<any>;
  options: {synchronize: boolean};
  name: string;
  initDexie?(db: DexieRequestService): void;
  initRest?(db: ApiRequestService): void;
  init(): void;
}


export class ServiceFactory {
  public static restDB: ApiRequestService = null;
  public static dexieDB: DexieRequestService = null;
  public static connectedMode: boolean = true;
  protected static services: Service[] = [];

  public static initService<T extends Service>(service: T): T {
    if (service.options) {
      service.options.synchronize = this.connectedMode;
    }
    if (service.dexie === null && service.initDexie) {
      service.initDexie(this.dexieDB);
    }
    if (service.rest === null && service.initRest) {
      service.initRest(this.restDB);
    }
    service.init();
    return service;
  }

  public static getService<T extends Service>(Ctor: new () => T): T {
    let service = new Ctor();
    const cachedService = this.services.find((_service) => _service.name === service.name);
    if (cachedService) {
      service = cachedService as T;
    } else {
      this.initService(service);
      this.services.push(service);
    }
    return service;
  }
}
