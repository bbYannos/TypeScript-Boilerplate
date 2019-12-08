import {Observable, of} from "rxjs";
import {AbstractApiModel, CookieUtils, DexieRequestService, DexieRestService} from "shared/abstract-api";
import {IsVinDexieBDD} from "../IsVinBDD.Dexie";
import {BaseApiManager} from "./Base.Manager";

export class AdminApiManager extends BaseApiManager {
  public static connectedMode: boolean = true;
  public static dexieDB: DexieRequestService = null;
  public static debug = false;

  public static get services() {
    return super.services.concat(
      [],
    );
  }

  public static toggleOnOffLine(): boolean {
    return CookieUtils.toggleCookie(CookieUtils.Names.OnOffLine);
  }

  // noinspection JSUnusedGlobalSymbols
  protected static get bDDsReady$(): Observable<boolean> {
    const cookieConnectedMode = CookieUtils.setIfNotSet(CookieUtils.Names.OnOffLine, "true");
    this.connectedMode = cookieConnectedMode !== "false";
    this.log("Connected Mode", this.connectedMode);
    if (!this.connectedMode) {
      this.dexieDB = new IsVinDexieBDD(this.connectedMode);
      this.dexieDB.init();
      return this.dexieDB.isReady$;
    }
    return of(true);
  }

  // noinspection JSUnusedGlobalSymbols
  protected static initAllServices() {
    if (this.dexieDB !== null) {
      this.services.forEach((service: DexieRestService<AbstractApiModel>) => {
        this.log("Init Dexie : " + service.name, (this.dexieDB !== null), (service.initDexie !== undefined));
        if (service.dexie === null && service.initDexie) {
          this.log("Connected Mode : " + service.name, this.connectedMode);
          service.options.synchronize = this.connectedMode;
          service.initDexie(this.dexieDB);
        }
      });
    }
    super.initAllServices();
  }
}
