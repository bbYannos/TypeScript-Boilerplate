import "assets/_user";
import Api, {UserService} from "modules/Api/login";
import {AbstractAppComponent, AppName} from "modules/AppTemplate/App";

// tslint:disable-next-line:max-classes-per-file
class AppComponent extends AbstractAppComponent {
  public userService: UserService = Api.userService;
  protected appName: AppName = "admin";
  protected render: () => void = () => {
    const layout =  null;
    layout.$mount("#app");
    console.log(layout);
  };
}

new AppComponent().init();
