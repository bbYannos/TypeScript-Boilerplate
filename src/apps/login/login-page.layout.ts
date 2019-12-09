import {LoginForm} from "components/forms/login-form";
import {RegisterForm} from "components/forms/register-form";
import Vue from "vue";
import Component from "vue-class-component";
import WithRender from "./login-page.layout.html";

@WithRender
@Component({
    components: {LoginForm, RegisterForm },
})
export class LoginPageLayout extends Vue {}
