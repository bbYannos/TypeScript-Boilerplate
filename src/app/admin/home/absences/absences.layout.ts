import {Component, Vue, VueComponent} from "shared/vue";
import {DashboardLink} from "../dashboard.link";
import WithRender from "./dashboard.layout.html";

@WithRender
@Component({components: {DashboardLink}})
export class AbsencesLayout extends Vue implements VueComponent {

}
