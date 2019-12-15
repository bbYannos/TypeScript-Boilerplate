
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

}
export default Vue.component("admin-page-layout", AdminPageLayout);



