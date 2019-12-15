import Vue from "vue";
import Component from "vue-class-component";
import WithRender from "./list.layout.html";

@WithRender
@Component
export class FormationsLayout extends Vue {
}
export default Vue.component("formations-layout", FormationsLayout);
