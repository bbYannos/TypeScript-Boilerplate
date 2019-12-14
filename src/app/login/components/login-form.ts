import {MessageComponent} from "components/forms/message";
import Api from "modules/Api/Api.module";
import {of} from "rxjs";
import {catchError} from "rxjs/operators";
import Vue from "vue";
import Component from "vue-class-component";
import WithRender from "./login-form.html";

@WithRender
@Component({components: {MessageComponent}})
export class LoginForm extends Vue {
  public loading: boolean = false;
  public message: MessageComponent["data"] = null;
  public data: { username: string, password: string } = {username: "", password: ""};

  public submit(e: Event) {
    e.preventDefault();
    this.loading = true;
    this.message = null;
    Api.userService.login(this.data).pipe(
      catchError((error) => {
        this.loading = false;
        this.message = {type: "danger", label: null, detail: error.data.message};
        return of(false);
      }),
    ).subscribe(() => this.loading = false);
  }
}
export default Vue.component("login-form-c", LoginForm);
