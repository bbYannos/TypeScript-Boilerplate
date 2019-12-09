import Api from "modules/Api/login";
import Vue from "vue";
import Component from "vue-class-component";
import {LANG} from "./labels";
import {MessageComponent} from "./message";
import WithRender from "./register-form.html";

@WithRender
@Component({components: {MessageComponent}})
export class RegisterForm extends Vue {
  public loading: boolean = false;
  public message: MessageComponent["data"] = null;
  public data: { username: string, password: string, repeatPassword: string } = {username: "", password: "", repeatPassword: ""};

  public submit(e: Event) {
    e.preventDefault();
    this.loading = true;
    this.message = null;
    Api.userService.register(this.data).subscribe(() => {
      this.loading = false;
      this.message = {type: "success", label: LANG.register.success.label , detail: LANG.register.success.detail};
    }, (error) => {
      this.loading = false;
      this.message = {type: "danger", label: error.data.code, detail: error.data.message};
    });
  }
}
export default Vue.component("register-form-c", RegisterForm);
