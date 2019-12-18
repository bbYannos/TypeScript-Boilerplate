import Vue from "vue";
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";
import {RouteConfig} from "vue-router";
import WithRender from "./sub-nav-bar.html";

@WithRender
@Component
export class SubNavBar extends Vue {
  @Prop({default: {label: "", routes: []}})
  public data: {
    label: string,
    routes: RouteConfig[],
  };

}
export default Vue.component("sub-nav-bar", SubNavBar);
