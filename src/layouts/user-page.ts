import {HeaderComponent} from "components/header";
import Vue from "vue";
import Component from "vue-class-component";
import WithRender from "./user-page.html";

@WithRender
@Component({components: {HeaderComponent}})
export class MainPageLayout extends Vue {}
export default Vue.component("main-page", MainPageLayout);
