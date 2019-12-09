import Vue from "vue";
import Component from "vue-class-component";
import WithRender from "./full-page.html";

@WithRender
@Component
export class FullPageLayout extends Vue {}
export default Vue.component("full-page", FullPageLayout);
