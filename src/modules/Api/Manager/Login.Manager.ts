import {switchMap, take} from "rxjs/operators";
import {
  AbstractApiModel,
  AbstractInitService,
  AbstractManager,
  ApiRequestService,
  DexieRestService,
} from "shared/abstract-api";
import {IsVinRestBDD} from "../isVinBDD.Rest";
import {UserService, userService, WpUserModel} from "../Service";

export class LoginManager extends AbstractManager {
  public static restDB: ApiRequestService = new IsVinRestBDD();
  public static userService: UserService = userService;
  public static currentWpUser: WpUserModel = null;
  public static get services(): AbstractInitService[] {
    return [userService];
  }

  public static init() {
    this.userService.userJson$.pipe(
      take(1),
      switchMap(() => this.ready$),
    ).subscribe();
    this.userService.initRest(this.restDB);
  }

  protected static initAllServices() {
    this.services.forEach((service: DexieRestService<AbstractApiModel>) => {
      this.log("Init rest : " + service.name, (this.restDB !== null), (service.initRest !== undefined));
      if (service.rest === null && service.initRest) {
        service.initRest(this.restDB);
      }
    });
    super.initAllServices();
  }
}
