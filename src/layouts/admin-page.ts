import {HeaderComponent} from "components/header";
import Vue from "vue";
import Component from "vue-class-component";
import WithRender from "./admin-page.html";

@WithRender
@Component({components: {HeaderComponent}})
export class AdminPageLayout extends Vue {}
export default Vue.component("admin-page", AdminPageLayout);
