import {ServiceFactory} from "shared/abstract-api/service.factory";
import {IsVinRestBDD} from "./isVinBDD.Rest";
import {UserService, WpUserModel} from "./Model/User/User.Service";

import {Api} from "./Api.module";

export {UserService, WpUserModel};

class LoginApi {
  static get export() {
    ServiceFactory.restDB = new IsVinRestBDD();
    for (const key in Api) {
      ServiceFactory.initService(Api[key]);
    }
    return Api;
  }
}

export default LoginApi.export;
