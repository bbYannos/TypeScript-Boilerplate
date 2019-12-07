import "assets/base";
import {AbstractAppComponent, AppName, Layout} from "modules/AppTemplate/App";
import {timer} from "rxjs";
import moment from "shared/moment";

import Api from "modules/Api/login";


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
  protected appName: AppName = "login";
  protected api = Api;
}
const app = new AppComponent().init();

timer(1000).subscribe(() => {
  console.log("passe");
  Api.userService.login({username: "yann", password: "Vodka22&Sedi"}).subscribe();
});





