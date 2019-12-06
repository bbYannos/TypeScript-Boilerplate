import {Observable, of} from "rxjs";
import {filter, map, switchMap, take, tap} from "rxjs/operators";
import {DexieRestService} from "../dexie-rest.service";
import {RxjsUtils} from "../rxjs.utils";
import {AbstractApiModel} from "./models";
import {AbstractInitService, AbstractRepositoryService} from "./services";

export class AbstractManager {
  public static get ready$(): Observable<boolean> {
    if (this._ready$ === null) {
      this._ready$ = this.bDDsReady$.pipe(
        switchMap(() => {
          // Combine all service Readies
          const readies$ = this.services.map((service: AbstractRepositoryService<any>) =>
            service.ready$.pipe(
              tap((readies: boolean[]) => this.log((service.repository) ? service.repository.constructorName : service, readies.flat())),
              map((readies: boolean[]) => readies.indexOf(false) === -1),
            ),
          );
          return RxjsUtils.combineLatest(readies$, [true]).pipe(
            tap((res: boolean[]) => this.log("READIES LEVEL 2", res, res.indexOf(false))),
            map((readies: boolean[]) => (readies.indexOf(false) === -1)),
          );
        }),
        filter((res: boolean) => res),
      );
    }
    this.initAllServices();
    return this._ready$;
  }

  public static get isReady$(): Observable<boolean> {
    return this.ready$.pipe(
      filter((ready: boolean) => ready),
      take(1),
    );
  }

  protected static get bDDsReady$(): Observable<boolean> {
    return of(true);
  }
  public static services: AbstractInitService[] = [];
  public static debug: boolean = false;

  public static init() {
    this.initAllServices();
  }
  protected static _ready$ = null;

  protected static initAllServices() {
    this.services.forEach((service: DexieRestService<AbstractApiModel>) => {
      this.log("Init Service : " + service.name);
      service.init();
    });
  }

  protected static log(...params) {
    if (this.debug) {
      console.log(...params);
    }
  }
}
