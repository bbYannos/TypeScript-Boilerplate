import Vue from "vue";
import Component from "vue-class-component";
import {HeaderComponent} from "components/header";
import WithRender from "./main-page.html";

@WithRender
@Component({components: {HeaderComponent}})
export class MainPageLayout extends Vue {}
export default Vue.component("main-page", MainPageLayout);
