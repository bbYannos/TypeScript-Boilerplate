import Vue from "vue";
import Component from "vue-class-component";
import WithRender from "./loader.html";

@WithRender
@Component
export class LoaderComponent extends Vue {}

export default  Vue.component("loader-c", LoaderComponent);
