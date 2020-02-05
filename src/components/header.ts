import Api, {WpUserModel} from "modules/Api/Api.module";
import {Subject, timer} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {CookieUtils, ServiceFactory} from "shared/abstract-api";
import {Component, Vue, VueComponent} from "shared/vue";
import {ToggleButton} from "vue-js-toggle-button";
import "./header.css";
import WithRender from "./header.html";

@WithRender
@Component({components: {ToggleButton}})
export class HeaderComponent extends Vue implements VueComponent {
  public userService = Api.userService;
  public isAdmin: boolean = false;

  public toggleData = {
    width: 100,
    fontSize: 14,
    labels: {checked: "En ligne", unchecked: "Brouillon"},
    value: ServiceFactory.connectedMode,
  };

  public close_: Subject<void> = new Subject<void>();

  public created() {
    this.userService.user$.pipe(takeUntil(this.close_)).subscribe((user: WpUserModel) => {
      this.isAdmin = user.isAdmin;
    });
  }

  public toggleOnOffLine() {
    CookieUtils.toggleCookie(CookieUtils.Names.OnOffLine);
    timer(500).subscribe(() => {
      window.location.reload();
    });
  }

  public beforeDestroy(): void {
    this.close_.next();
    this.close_.complete();
  }

}
export default  Vue.component("header-c", HeaderComponent);
