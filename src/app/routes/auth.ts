import Api, {WpUserModel} from "modules/Api/Api.module";
import {map, tap} from "rxjs/operators";
import {AbstractInitService} from "shared/abstract-api";
import {loginRoute, routes} from "./routes";

export class RouterAuthService extends AbstractInitService {
  public name = "AuthService";
  public user: WpUserModel = null;
  public userChange$ = Api.userService.user$.pipe(tap((user) => this.user = user));
  public ready$ = Api.userService.user$.pipe(
    map(() => [true]),
  );

  public init() {
    Api.userService.checkStoredSession();
    return this.ready$;
  }

  public checkAccessRights(to, from, next) {
    const {authorize} = to.meta;

    if (!authorize) {
      return next();
    }

    if (this.user === null) {
      if (to.path === loginRoute.path) {
        return next();
      }
      return next({...loginRoute, ...{query: {redirect: to.fullPath}}});
    }
    if (this.user.hasRole(authorize)) {
      return next();
    }
    const loggedRoute = routes.find((route) => {
      const {authorize: _authorize} = route.meta;
      if (_authorize) {
        return this.user.hasRole(_authorize);
      }
    });

    if (loggedRoute) {
      return next(loggedRoute);
    }
    alert("Pas de rôle attribué à ce profil");
    this.logout();
    return next(false);
  }

  public logout = () => Api.userService.logout();
}
