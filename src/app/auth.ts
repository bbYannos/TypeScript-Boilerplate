import Api, {WpUserModel} from "modules/Api/login";
import {map, take} from "rxjs/operators";
import {AbstractInitService, ServiceFactory} from "shared/abstract-api";

export const Roles = {
  Admin: "Admin",
  Speaker: "Speaker",
  Trainee: "Trainee",
};

export class RouterAuthService extends AbstractInitService {
  public name = "AuthService";
  public ready$ = Api.userService.user$.pipe(
    map((wpUser: WpUserModel) => [true]),
  );

  public init() {
    ServiceFactory.initService(Api.userService);
    Api.userService.checkStoredSession();
    return this.ready$;
  }

  public checkPage(to, from, next) {
    const { authorize } = to.meta;
    Api.userService.user$.pipe(take(1)).subscribe((wpUser) => {
      if (authorize && wpUser === null) {
        next({ path: "/",  query: {redirect: to.fullPath}});
      } else {
        next();
      }
    });
  }

  public logout = () => Api.userService.logout();
}
