import {CookieUtils} from "./cookie.utils";
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
  public static get connectedMode(): boolean {
    return CookieUtils.getCookie(CookieUtils.Names.OnOffLine) !== "false";
  };

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
}
