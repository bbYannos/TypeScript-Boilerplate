import {Observable} from "rxjs";
import {switchMap, take} from "rxjs/operators";
import {
  AbstractApiModel,
  AbstractInitService,
  AbstractManager,
  ApiRequestService, DexieRequestService,
  DexieRestService, RestService,
} from "shared/abstract-api";

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
  public static userService: UserService;
  public static services: AbstractInitService[] = [];
  public static connectedMode: boolean = true;

  public static init() {
    this.userService.userJson$.pipe(
      take(1),
      switchMap(() => this.ready$),
    ).subscribe();
  }

}
