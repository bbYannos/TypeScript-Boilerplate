import {Component, Vue, VueComponent} from "shared/vue";
import WithRender from "./dashboard.layout.html";
import {DashboardLink} from "./dashboard.link";

@WithRender
@Component({components: {DashboardLink}})
export class DashboardLayout extends Vue implements VueComponent {

}
