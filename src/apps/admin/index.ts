import "assets/_main";
import Api, {UserService} from "modules/Api/login";
import {AbstractAppComponent, AppName, Layout} from "modules/AppTemplate/App";
import moment from "shared/moment/moment";

class PageLayout implements Layout {
  public $htmEl: HTMLElement = null;

  public render(): void {
    this.$htmEl.innerHTML = moment().format("HH:mm");
  }
}

// tslint:disable-next-line:max-classes-per-file
class AppComponent extends AbstractAppComponent {
  public layout = new PageLayout();
  public userService: UserService = Api.userService;
  protected appName: AppName = "admin";
}

const app = new AppComponent().init();
