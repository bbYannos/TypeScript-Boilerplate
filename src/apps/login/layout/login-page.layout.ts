import {IconsService} from "assets/Icons.Service";
import Api from "modules/Api/login";
import {of} from "rxjs";
import {catchError} from "rxjs/operators";
import {FormUtils} from "shared/forms/form-utils";
import {ComponentNjk} from "shared/nunjucks";

export class LoginPageLayout extends ComponentNjk {
  protected constructorName: string = "LoginPageLayout";
  protected njk = require("./login-page.layout.html");

  public render() {
    super.render({});
    this.manageLoginForm();
    this.manageSubscribeForm();
  }

  protected manageSubscribeForm() {
    const form$ = this.find("#subscribe-form form");
    const alert$ = this.find("#subscribe-form .alert-danger");
    const success$ = this.find("#subscribe-form  .alert-success");
    const submit$ = this.find("#subscribe-form .submit-btn");
    const submitHtml = submit$.innerHTML;
    form$.addEventListener("submit", (e) => {
      e.preventDefault();
      alert$.style.display = "none";
      submit$.innerHTML = IconsService.loadingSpin + submitHtml;

      Api.userService.register(FormUtils.toJSON(form$[0] as HTMLFormElement)).subscribe(() => {
        submit$.innerHTML = submitHtml;
        success$.style.display = "block";
      }, (error) => {
        submit$.innerHTML = submitHtml;
        alert$.querySelector("h4 span").innerHTML = error.data.code;
        alert$.querySelector("p.message").innerHTML = error.data.message;
        alert$.style.display = "block";
      });
    });
  }

  protected manageLoginForm() {
    const form$ = this.find("#login-form form");
    const alert$ = this.find("#login-form .alert-danger");
    const submit$ = this.find("#login-form .submit-btn");
    const submitHtml = submit$.innerHTML;
    form$.addEventListener("submit", (e) => {
      e.preventDefault();
      alert$.style.display = "none";
      submit$.innerHTML = IconsService.loadingSpin + submitHtml;
      Api.userService.login(FormUtils.toJSON(form$ as HTMLFormElement) as { username: string, password: string }).pipe(
        catchError((error) => {
          alert$.querySelector("p.message").innerHTML = error.data.message;
          alert$.style.display = "block";
          submit$.innerHTML = submitHtml;
          return of(false);
        }),
      ).subscribe();
    });
  }
}
