import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {AbstractInitService, ApiRequestService} from "shared/abstract-api";

export class DownloadService extends AbstractInitService {
  protected rest: ApiRequestService = null;

  public get name(): string {
    return "Download";
  }

  public planningXLSX(): Observable<any> {
    const action = "xls/planning/";
    return this.rest.get(action).pipe(map((response: any) => {
      return window.atob(response.content);
    }));
  }

  public initRest(restApiRequestService: ApiRequestService) {
    this.rest = restApiRequestService;
  }
}
