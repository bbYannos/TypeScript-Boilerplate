import {Component, Vue, VueComponent} from "shared/vue";
import {AbsencesLayout} from "./absences/absences.layout";
import WithRender from "./dashboard.layout.html";
import {DashboardLink} from "./dashboard.link";

const absencesRoute = {path: "absences", meta: {icon: "timer-off", label: "Absences & Retards"}, component: AbsencesLayout};
const scoresRoute = {path: "scores", meta: {icon: "chart-line", label: "Exams & notes"}, component: AbsencesLayout};
@WithRender
@Component({components: {DashboardLink}})
export class DashboardLayout extends Vue implements VueComponent {
  public routes = [
    absencesRoute,
    scoresRoute,
  ];
}
