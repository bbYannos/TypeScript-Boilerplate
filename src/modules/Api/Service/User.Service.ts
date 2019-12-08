import {BehaviorSubject, Observable, of, Subject} from "rxjs";
import {filter, map, shareReplay, take, tap} from "rxjs/operators";
import {
  AbstractRepository,
  API_METHODS,
  ApiRequestService,
  CookieUtils,
  Repository,
  RestService,
} from "shared/abstract-api";
import {User} from "../Model/User.Model";
import {WpUserModel} from "../Model/WpUser.Model";
export {User, WpUserModel};
class JwAuthResponse {
  public token: string;
  // tslint:disable-next-line:variable-name
  public user_email: string;
}

// tslint:disable-next-line:max-classes-per-file
export class UserService extends RestService<User> {
  public repository: AbstractRepository<User> = new Repository(User);
  protected userJson_: BehaviorSubject<void> = new BehaviorSubject(null);
  // tslint:disable-next-line:member-ordering
  public userJson$ = this.userJson_.asObservable().pipe(filter((json) => json !== null));

  protected user_: Subject<WpUserModel> = new Subject();
  // tslint:disable-next-line:member-ordering
  public user$ = this.user_.asObservable().pipe(
    shareReplay(1),
  );
  // tslint:disable-next-line:member-ordering
  public userConnected$ = this.user$.pipe(
    filter((user) => user !== null),
    take(1),
  );

  protected cookieName = "token";
  protected jwAuthEndPoint = null;

  public init() {
    WpUserModel.fromJson$(this.userJson_.getValue()).subscribe((wpUser: WpUserModel) => {
      this.ready_.next([true]);
      this.user_.next(wpUser);
    });
  }

  public initRest(restApiRequestService: ApiRequestService) {
    const response = super.initRest(restApiRequestService);
    this.jwAuthEndPoint = restApiRequestService.authEndPoint;
    this.checkStoredSession();
    return response;
  }

  public checkStoredSession() {
    const storedToken = CookieUtils.getCookie(this.cookieName);
    this.rest.restApiRequestService.token = storedToken;
    if (storedToken !== null && storedToken !== "") {
      this.getCurrentUserFromApi().subscribe((json: any) => {
        this.userJson_.next(json);
      }, (error) => {
        this.rest.restApiRequestService.token = null;
        CookieUtils.deleteCookie(this.cookieName);
        this.user_.next(null);
        throw error;
      });
    } else {
      // console.log("User", null);
      this.user_.next(null);
    }
    return this.userConnected$;
  }

  public login(request: { username: string, password: string }): Observable<boolean> {
    return this.getToken(request).pipe(
      map((data: JwAuthResponse) => {
        CookieUtils.setCookie(this.cookieName, data.token);
        this.rest.restApiRequestService.token = data.token;
        return true;
      }),
      tap(() => this.checkStoredSession()),
    );
  }

  public register(request): Observable<boolean> {
    const action = this.rest.defaultActionRoute + "register";
    return this.rest.restApiRequestService.addRequest(action, API_METHODS.POST, request);
  }

  public logout(): Observable<boolean> {
    CookieUtils.deleteCookie(this.cookieName);
    this.rest.restApiRequestService.token = null;
    this.user_.next(null);
    return of(true);
  }

  protected getToken(request: { username: string, password: string }): Observable<any> {
    const action = this.jwAuthEndPoint + "token";
    return this.rest.restApiRequestService.addRequestWithFullUrl(action, API_METHODS.POST, request);
  }

  protected getCurrentUserFromApi(): Observable<any> {
    const action = this.rest.defaultActionRoute + "current";
    return this.rest.restApiRequestService.addRequest(action, API_METHODS.GET);
  }
}

