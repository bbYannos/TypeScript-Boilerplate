import {tap} from "rxjs/operators";
import {WpUserModel} from "../Api";
import {LoginManager} from "../Api/Manager/Login.Manager";

export type AppName = ("admin" | "trainee" | "speaker" | "login");
export const APP_PAGES = {
  admin: "admin",
  trainee: "student",
  speaker: "teacher",
  login: "index",
};

export interface Layout {
  $htmEl: HTMLElement;
  render(): void;
}

export abstract class AbstractAppComponent {
  public layout: Layout;
  public debug = false;
  protected api = LoginManager;
  protected abstract appName: AppName;

  protected get $app(): HTMLElement {
    return document.getElementById("app");
  }

  public init() {
    this.api.userService.user$.pipe(
      tap((wpUser: WpUserModel) => {
        this.api.currentWpUser = wpUser;
        if (this.getUserApp(wpUser) !== this.appName) {
          if (!this.debug) {
            document.location.href = this.getUserPage(wpUser) + ".html";
          }
        } else {
          this.showLayout();
        }
      }),
    ).subscribe();
    this.api.init();
    return this;
  }

  // noinspection JSMethodCanBeStatic
  protected getUserApp(wpUser: WpUserModel): AppName {
    if (wpUser === null) {
      return "login";
    }
    if (wpUser.isAdmin) {
      return "admin";
    }
    if (wpUser.isSpeaker) {
      return "speaker";
    }
    if (wpUser.isTrainee) {
      return "trainee";
    }
    return "login";
  }

  protected getUserPage(wpUser: WpUserModel) {
    return APP_PAGES[this.getUserApp(wpUser)];
  }

  // noinspection JSMethodCanBeStatic
  protected showLayout() {
    this.layout.$htmEl = this.$app;
    this.layout.render();
  }
}
