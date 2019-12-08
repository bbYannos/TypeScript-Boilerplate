import "assets/_base";
import Api, {UserService} from "modules/Api/login";
import {AbstractAppComponent, AppName} from "modules/AppTemplate/App";
import {LoginPageLayout} from "./layout/login-page.layout";

// tslint:disable-next-line:max-classes-per-file
class AppComponent extends AbstractAppComponent {
  public layout = new LoginPageLayout();
  public userService: UserService = Api.userService;
  protected appName: AppName = "login";
  protected api = Api;
}
new AppComponent().init();




