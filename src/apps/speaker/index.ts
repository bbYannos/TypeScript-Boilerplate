import "assets/_user";
import Api, {UserService} from "modules/Api/login";
import {AbstractAppComponent, AppName} from "modules/AppTemplate/App";
import {SpeakerLayout} from "./layout/speaker-page.layout";

// tslint:disable-next-line:max-classes-per-file
class AppComponent extends AbstractAppComponent {
  public layout = new SpeakerLayout();
  public userService: UserService = Api.userService;
  protected appName: AppName = "speaker";
}
new AppComponent().init();




