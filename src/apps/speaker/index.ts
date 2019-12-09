import "assets/_user";
import {FullPageLayout} from "layouts/full-page.layout";
import Api, {UserService} from "modules/Api/login";
import {AbstractAppComponent, AppName} from "modules/AppTemplate/App";

// tslint:disable-next-line:max-classes-per-file
class AppComponent extends AbstractAppComponent {
  public userService: UserService = Api.userService;
  protected appName: AppName = "speaker";
  protected render: () => void = () => {
    new FullPageLayout();
  };
}

new AppComponent().init();
