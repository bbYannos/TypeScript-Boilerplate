import "assets/_base";
import Vue from "vue";
import {App} from "./app";
import {router, routerAuthService} from "./routes/router";

routerAuthService.isReady$.subscribe(() => {
  // tslint:disable-next-line
  new Vue({
    router,
    el: "#app",
    // replace the content of <div id="app"></div> with App
    render: (h) => h(App),
  });
});

routerAuthService.init();
