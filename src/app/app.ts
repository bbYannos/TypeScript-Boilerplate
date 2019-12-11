import Vue from "vue";
import Component from "vue-class-component";
import WithRender from "./app.html";
import {LoginPageLayout} from "./login/login-page.layout";
import {SpeakerPageLayout} from "./routes/routes";

@WithRender
@Component({components: {LoginPageLayout, SpeakerPageLayout}})
export class App extends Vue {}
