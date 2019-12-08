import axios, {AxiosRequestConfig, AxiosResponse} from "axios";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {ObjectUtils} from "shared/utils/object.utils";
import {RxjsUtils} from "../rxjs.utils";

export enum API_METHODS {
  GET = "get",
  POST = "post",
  PUT = "put",
  DELETE = "delete",
}

export class ApiRequest {
  public url: string = "";
  public method: string = "";
  public params: any;
  public token: string = "";

  get httpOptions(): AxiosRequestConfig {
    const _headers: any = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    };
    if (this.token) {
      // _headers.authorization = this.token;
      _headers.Authorization = "Bearer " + this.token;
    }
    return {
      headers: _headers,
      withCredentials: true,
    };
  }

  public execute(): Observable<any> | null {
    let httpClientCall: Promise<AxiosResponse> | null = null;
    switch (this.method) {
      default:
      case API_METHODS.GET :
        const urlParams = ObjectUtils.ObjectToUrlParams(this.params);
        if (urlParams.length) {
          this.url += "?" + urlParams.join("&");
        }
        httpClientCall = axios[this.method](this.url, this.httpOptions);
        break;
      case API_METHODS.DELETE :
        const httpOptions = this.httpOptions;
        if (this.params !== null) {
          httpOptions.params = this.params;
        }
        httpClientCall = axios[this.method](this.url, httpOptions);
        break;
      case API_METHODS.PUT  :
      case API_METHODS.POST :
        httpClientCall = axios[this.method](this.url, this.params, this.httpOptions);
        break;
    }

    return RxjsUtils.promiseToObservable(httpClientCall).pipe(
      map((response) => response.data),
    );
  }
}
