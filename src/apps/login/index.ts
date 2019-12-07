import "assets/base";
import {AbstractAppComponent, AppName, Layout} from "modules/AppTemplate/App";
import moment from "shared/moment/moment";

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
}

const app = new AppComponent().init();
