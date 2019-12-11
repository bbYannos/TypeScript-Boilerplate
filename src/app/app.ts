import Vue from "vue";
import Component from "vue-class-component";
import WithRender from "./app.html";
import {LoginPageLayout} from "./login/login-page.layout";
import {SpeakerPageLayout} from "./speaker/speaker-page.layout";

@WithRender
@Component({components: {LoginPageLayout, SpeakerPageLayout}})
export class App extends Vue {}
