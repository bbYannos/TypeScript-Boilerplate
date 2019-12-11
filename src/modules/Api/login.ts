import {ServiceFactory} from "shared/abstract-api/service.factory";
import {IsVinRestBDD} from "./isVinBDD.Rest";
import {UserService} from "./Service/User.Service";
export * from "./Service/User.Service";

class LoginApi {
  static get export() {
    ServiceFactory.restDB = new IsVinRestBDD();
    const userService = ServiceFactory.getService<UserService>(UserService);
    return {
      userService: userService,
    };
  }
}
export default LoginApi.export;
