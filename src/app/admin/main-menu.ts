import Vue from "vue";
import Component from "vue-class-component";
import WithRender from "./main-menu.html";
import {adminRouter} from "./routes";

@WithRender
@Component({router: adminRouter})
export class MainMenu extends Vue {
}
export default Vue.component("main-menu", MainMenu);
