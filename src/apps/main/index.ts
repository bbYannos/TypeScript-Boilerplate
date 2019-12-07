import "assets/main";
import Dexie from "dexie/dist/dexie";
import {from, Observable, timer} from "rxjs";
import {map, switchMap, take, tap} from "rxjs/operators";
import mainContent from "shared/lib-other";
import appTitle from "shared/lib-test";

timer(1000, 1000).pipe(
  take(3),
).subscribe(() => console.log(appTitle.name));

const $app = document.getElementById("app");
if ($app !== null) {
  $app.innerHTML = mainContent.home;
}

const Axios$ = (): Observable<any> => from(import(/* webpackChunkName: "axios" */  "axios")).pipe(
  map((res) => res.default),
);


timer(3000).pipe(
  switchMap(() => Axios$()),
).subscribe();


const Dexie$: (name: string) => Observable<any>  = () => from(import(/* webpackChunkName: "dexie" */  "dexie")).pipe(
  map((dexieModule) => dexieModule.default),
  tap((DexieCtor) => console.log(DexieCtor.delete)),
  switchMap((DexieCtor) => DexieCtor.exists("toto")),
  tap((res) => console.log(res)),
);

timer(3000).pipe(
  switchMap(() => Dexie$("test")),
).subscribe();







