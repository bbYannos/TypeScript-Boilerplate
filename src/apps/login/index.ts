import "assets/_base";
import {LoginPageLayout} from "./login-page.layout";
import Api, {UserService} from "modules/Api/login";
import {AbstractAppComponent, AppName} from "modules/AppTemplate/App";

// tslint:disable-next-line:max-classes-per-file
class AppComponent extends AbstractAppComponent {
  public userService: UserService = Api.userService;
  protected appName: AppName = "login";
  protected render: () => void = () => {
    new LoginPageLayout({el: "#app"});
  };
}
new AppComponent().init();




