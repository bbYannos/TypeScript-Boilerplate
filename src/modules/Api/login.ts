import {ServiceFactory} from "shared/abstract-api/service.factory";
import {IsVinRestBDD} from "./isVinBDD.Rest";
import {LoginManager} from "./Manager/Login.Manager";
import {UserService} from "./Service/User.Service";

class LoginApi {
  static get export() {
    ServiceFactory.restDB = new IsVinRestBDD();
    LoginManager.userService = ServiceFactory.getService<UserService>(UserService);
    ServiceFactory.initService(LoginManager.userService);
    return LoginManager;
  }
}
export default LoginApi.export;
