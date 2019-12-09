import Vue from "vue";
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";
import WithRender from "./null.html";

@WithRender
@Component
export class NullComponent extends Vue {
  @Prop({default: null})
  public data: {};
}
export default Vue.component("null-c", NullComponent);
