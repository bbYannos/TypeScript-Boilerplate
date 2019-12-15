import {HeaderComponent} from "components/header";
import Vue from "vue";
import Component from "vue-class-component";
import WithRender from "./menu-page.html";

@WithRender
@Component({components: {HeaderComponent}})
export class MenuPageLayout extends Vue {}
export default Vue.component("menu-page", MenuPageLayout);
