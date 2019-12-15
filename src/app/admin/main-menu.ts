import Vue from "vue";
import Component from "vue-class-component";
import WithRender from "./main-menu.html";

@WithRender
@Component
export class MainMenu extends Vue {
}
export default Vue.component("main-menu", MainMenu);
