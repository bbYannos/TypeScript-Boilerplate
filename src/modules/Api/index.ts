import {from} from "rxjs";
import {shareReplay} from "rxjs/operators";
import {ServiceFactory} from "../../shared/abstract-api";
import {Api} from "./Api.module";
import {IsVinRestBDD} from "./isVinBDD.Rest";

export const apiModule$ = from(import(/* webpackChunkName: "full-calendar" */ "./Api.module")).pipe(
  shareReplay(1),
);

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
