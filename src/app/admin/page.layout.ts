import "assets/_main";
import {CalendarWrapper} from "components/calendar-wrapper";
import {MenuPageLayout} from "layouts/menu-page";
import Vue from "vue";
import Component from "vue-class-component";
import {MainMenu} from "./main-menu";
import WithRender from "./page.layout.html";

@WithRender
@Component({
  components: {MenuPageLayout, MainMenu, CalendarWrapper},
})
export class AdminPageLayout extends Vue {
}
export default Vue.component("admin-page-layout", AdminPageLayout);



