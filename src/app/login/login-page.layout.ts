import {FullPageLayout} from "layouts/full-page";
import Vue from "vue";
import Component from "vue-class-component";
import {LoginForm} from "./components/login-form";
import {RegisterForm} from "./components/register-form";
import WithRender from "./login-page.layout.html";

@WithRender
@Component({
    components: {FullPageLayout, LoginForm, RegisterForm },
})
export class LoginPageLayout extends Vue {}
export default Vue.component("login-layout", LoginPageLayout);


