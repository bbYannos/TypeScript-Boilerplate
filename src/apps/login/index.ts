import "assets/_base";
import Api, {UserService} from "modules/Api/login";
import {AbstractAppComponent, AppName, Layout} from "modules/AppTemplate/App";
import {timer} from "rxjs";
import moment from "shared/moment";

// tslint:disable-next-line
class PageLayout implements Layout {
  public $htmEl: HTMLElement = null;

  public render(): void {
    this.$htmEl.innerHTML = moment().format("HH:mm:sss");
  }
}

// tslint:disable-next-line:max-classes-per-file
class AppComponent extends AbstractAppComponent {
  public layout = new PageLayout();
  public userService: UserService = Api.userService;
  protected appName: AppName = "login";
  protected api = Api;
}

const app = new AppComponent().init();

timer(5000).subscribe(() => {
  console.log("passe");
  Api.userService.login({username: "yann", password: "Vodka22&Sedi"}).subscribe();
});





