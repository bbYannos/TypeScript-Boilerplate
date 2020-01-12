import {Component, Prop, Vue, VueComponent} from "shared/vue";
import WithRender from "./dashboard.link.html";

@WithRender
@Component
export class DashboardLink extends Vue implements VueComponent {
  @Prop({default: null})
  public icon: string;
  @Prop({default: null})
  public label: string;
  @Prop({default: ""})
  public path: string;
}
export default Vue.component("dash-link-c", DashboardLink);
