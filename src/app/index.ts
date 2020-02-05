import "assets/_base";
import Vue from "vue";
import Component from "vue-class-component";
import WithRender from "./app.html";
import {router, routerAuthService} from "./routes/router";

@WithRender
@Component({router: router})
export class App extends Vue {}




routerAuthService.isReady$.subscribe(() => {
  // tslint:disable-next-line
  const app = new App();
  app.$mount("#app");
});

routerAuthService.init();
