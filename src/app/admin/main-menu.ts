import Vue from "vue";
import Component from "vue-class-component";
import WithRender from "./main-menu.html";
import {adminRouter, adminRoutes} from "./routes";

@WithRender
@Component({router: adminRouter})
export class MainMenu extends Vue {
  public routes = adminRoutes;
  public match(route) {
    return this.$route.matched.filter((_route) => _route.path === route.path).length > 0;
  }
}

export default Vue.component("main-menu", MainMenu);
