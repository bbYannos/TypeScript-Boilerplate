import {ServiceFactory} from "shared/abstract-api/service.factory";
import {IsVinRestBDD} from "./isVinBDD.Rest";
import "./RelationManager";
import {UserService} from "./Model/User/User.Service";

export * from "./Model/User/User.Service";
class LoginApi {
  static get export() {
    ServiceFactory.restDB = new IsVinRestBDD();

    return {
      userService: ServiceFactory.getService<UserService>(UserService),
    };
  }
}
export default LoginApi.export;
