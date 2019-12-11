import Vue from "vue";
import Router from "vue-router";
import {loginRoute, Roles, RouterAuthService} from "./auth";
import {SpeakerPageLayout} from "./speaker/speaker-page.layout";

Vue.use(Router);

export const router = new Router({
  mode: "history",
  base: __dirname,
  routes: [
    {path: "/", meta: {authorize: [null]}},
    loginRoute,
    {path: "/speaker", component: SpeakerPageLayout, meta: {authorize: [Roles.Speaker]}},
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

router.beforeEach((to, from, next) => routerAuthService.checkAccessRights(to, from, next));




