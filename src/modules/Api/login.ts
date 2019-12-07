import {IsVinRestBDD} from "./isVinBDD.Rest";
import {LoginManager} from "./Manager/Login.Manager";
import userService from "./Service/User.Service";

class LoginApi {
  static get export() {
    LoginManager.restDB = new IsVinRestBDD();
    LoginManager.userService = userService;
    return LoginManager;
  }
}

export default LoginApi.export;
