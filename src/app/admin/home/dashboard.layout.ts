import {Component, Vue, VueComponent} from "shared/vue";
import {RouteConfig} from "vue-router";
import {AbsencesLayout} from "./absences/absences.layout";
import WithRender from "./dashboard.layout.html";
import {DashboardLink} from "./dashboard.link";
import {ScoresLayout} from "./scores/scores.layout";

export const homePath = "/home";
const absencesRoute = {path: "absences", meta: {icon: "timer-off", label: "Absences & Retards"}, component: AbsencesLayout};
const scoresRoute = {path: "scores", meta: {icon: "chart-line", label: "Exams & notes"}, component: ScoresLayout};
export const dashboardRoutes: RouteConfig[] = [
  absencesRoute,
  scoresRoute,
];

@WithRender
@Component({components: {DashboardLink}})
export class DashboardLayout extends Vue implements VueComponent {
  public routes = dashboardRoutes;
  public homePath = homePath;
}
