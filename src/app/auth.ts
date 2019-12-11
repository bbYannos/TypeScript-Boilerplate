import Api from "modules/Api/login";
import {Role, WpUserModel} from "modules/Api/Model/WpUser.Model";
import {map, take} from "rxjs/operators";
import {AbstractInitService, ServiceFactory} from "shared/abstract-api";
import {LoginPageLayout} from "./login/login-page.layout";

export const Roles: {[key: string]: Role} = {
  Admin: "administrator",
  Speaker: "speaker",
  Trainee: "trainee",
};

export const loginRoute = {path: "/login", component: LoginPageLayout};

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

  public checkAccessRights(to, from, next) {
    const {authorize} = to.meta;

    if (authorize) {
      Api.userService.user$.pipe(take(1)).subscribe((wpUser) => {
        if (wpUser === null && to.fullPath !== loginRoute.path) {
          next({path: "/login", query: {redirect: to.fullPath}});
        }
      });
    } else {
      next();
    }
  }

  public logout = () => Api.userService.logout();
}
