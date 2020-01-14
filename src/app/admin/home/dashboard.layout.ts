import {Component, Vue, VueComponent} from "shared/vue";
import {RouteConfig} from "vue-router";
import {AbsencesModuleLayout, absencesRoutes} from "./absences/absences-module.layout";
import WithRender from "./dashboard.layout.html";
import {DashboardLink} from "./dashboard.link";
import {ScoresLayout} from "./scores/scores.layout";

export const homePath = "/home";
const absencesRoute = {
  path: "absences",
  redirect: "absences" + "/" + "index",
  meta: {icon: "timer-off", label: "Absences & Retards"},
  component: AbsencesModuleLayout,
  children: absencesRoutes,
};
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
