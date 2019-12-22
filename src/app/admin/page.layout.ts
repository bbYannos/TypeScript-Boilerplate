import {MainMenu} from "components/main-menu";
import {MenuPageLayout} from "layouts/menu-page";
import Vue from "vue";
import Component from "vue-class-component";
import {adminRouter, adminRoutes} from "./_routes";
import WithRender from "./page.layout.html";

@WithRender
@Component({
  components: {MenuPageLayout, MainMenu},
  router: adminRouter,
})
export class AdminPageLayout extends Vue {
  public routes = adminRoutes;
}

export default Vue.component("admin-page-layout", AdminPageLayout);



