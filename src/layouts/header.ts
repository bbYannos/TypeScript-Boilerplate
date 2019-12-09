import Api from "modules/Api/login";
import Vue from "vue";
import Component from "vue-class-component";
import WithRender from "./header.html";

@WithRender
@Component
export class HeaderComponent extends Vue {
  // noinspection JSMethodCanBeStatic
  public logout() {
    Api.userService.logout();
  }
}
export default  Vue.component("header-c", HeaderComponent);
