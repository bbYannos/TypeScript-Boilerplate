import {Observable} from "rxjs";
import {switchMap, take} from "rxjs/operators";
import {
  AbstractApiModel,
  AbstractInitService,
  AbstractManager,
  ApiRequestService,
  DexieRestService, RestService,
} from "shared/abstract-api";
import {IsVinRestBDD} from "../isVinBDD.Rest";

export interface WpUserModel {
  isAdmin: boolean;
  isSpeaker: boolean;
  isTrainee: boolean;
}

export interface UserService extends RestService<any> {
  userJson$: Observable<any>;
  user$: Observable<WpUserModel>;
  login(request: { username: string, password: string }): Observable<boolean>;
}

export class LoginManager extends AbstractManager {
  public static restDB: ApiRequestService = new IsVinRestBDD();
  public static userService: UserService;
  public static services: AbstractInitService[] = [];

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
