import Vue from "vue";
import Router from "vue-router";
import {Roles, RouterAuthService} from "./auth";
import {LoginPageLayout} from "./login/login-page.layout";
import {SpeakerPageLayout} from "./speaker/speaker-page.layout";

Vue.use(Router);
export const router = new Router({
  mode: "history",
  base: __dirname,
  routes: [
    {path: "/", component: LoginPageLayout},
    {path: "/speaker", component: SpeakerPageLayout,  meta: { authorize: [Roles.Speaker] } },
    {
      path: "/logout",
      beforeEnter(to, from, next) {
        routerAuthService.logout();
        next("/");
      },
    },
  ],
});
export const routerAuthService = new RouterAuthService();
router.beforeEach((to, from, next) => routerAuthService.checkPage(to, from, next));




