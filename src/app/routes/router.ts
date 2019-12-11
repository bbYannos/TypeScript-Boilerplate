import Vue from "vue";
import Router from "vue-router";
import {RouterAuthService} from "./auth";
import {afterLoginRoute, afterLogoutRoute, routes} from "./routes";
/*
* Preventing "NavigationDuplicated" errors in console in Vue-router >= 3.1.0
* https://github.com/vuejs/vue-router/issues/2881#issuecomment-520554378
* */
const routerMethods = ["push", "replace"];

routerMethods.forEach((method: string) => {
  const originalCall = (Router.prototype as any)[method];
  (Router.prototype as any)[method] = function(location: any, onResolve: any, onReject: any): Promise<any> {
    if (onResolve || onReject) {
      return originalCall.call(this, location, onResolve, onReject);
    }
    return (originalCall.call(this, location) as any).catch((err: any) => err);
  };
});

Vue.use(Router);

export const router = new Router({
  mode: "history",
  base: __dirname,
  routes: routes,
});

export const routerAuthService = new RouterAuthService();
routerAuthService.userChange$.subscribe((user) => {
  console.log(user);
  if (user === null) {
    // noinspection JSIgnoredPromiseFromCall
    router.push(afterLogoutRoute);
  } else {
    // noinspection JSIgnoredPromiseFromCall
    router.push(afterLoginRoute);
  }
});

router.beforeEach((to, from, next) => routerAuthService.checkAccessRights(to, from, next));




