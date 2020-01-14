import {Component, Vue, VueComponent} from "shared/vue";
import WithRender from "./scores.layout.html";

@WithRender
@Component
export class ScoresLayout extends Vue implements VueComponent {}
