import {tap} from "rxjs/operators";
import {ServiceFactory} from "../../shared/abstract-api";
import {UserService, WpUserModel} from "../Api/Model/User/User.Service";

export type AppName = ("admin" | "trainee" | "speaker" | "login");
export const APP_PAGES = {
  admin: "admin",
  trainee: "student",
  speaker: "teacher",
  login: "index",
};

export abstract class AbstractAppComponent {
  public debug = false;
  public abstract userService: UserService;
  protected abstract appName: AppName;

  protected get $app(): HTMLElement {
    return document.getElementById("app");
  }

  public init() {
    this.userService.user$.pipe(
      tap((wpUser: WpUserModel) => {
        if (this.getUserApp(wpUser) !== this.appName) {
          if (!this.debug) {
            document.location.href = this.getUserPage(wpUser) + ".html";
          }
        } else {
          this.render();
        }
      }),
    ).subscribe();
    ServiceFactory.initService(this.userService);
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
  protected abstract render: () => void;
}
