import "assets/_main";
import {MenuPageLayout} from "layouts/menu-page";
import Vue from "vue";
import Component from "vue-class-component";
import {FormationsLayout} from "./formation/list.layout";
import {MainMenu} from "./main-menu";
import WithRender from "./page.layout.html";
import {adminRouter} from "./routes";

@WithRender
@Component({
  components: {MenuPageLayout, MainMenu, FormationsLayout},
  router: adminRouter,
})
export class AdminPageLayout extends Vue {

  public mounted() {
    console.log(this.$router.getMatchedComponents(this.$router.currentRoute.path));
    console.log(this.$route);
  }

  public changed() {
    console.log(this.$route)
  }
}
export default Vue.component("admin-page-layout", AdminPageLayout);



