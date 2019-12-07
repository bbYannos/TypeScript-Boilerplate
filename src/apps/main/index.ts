import "assets/main";
import Dexie from "dexie/dist/dexie";
import {from, Observable, timer} from "rxjs";
import {map, switchMap, take} from "rxjs/operators";
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
  map(({ default: axios }) => axios),
);


timer(3000).pipe(
  switchMap(() => Axios$()),
).subscribe((axios) => {
  console.log(axios);
});


const Dexie$: (name: string) => Observable<Dexie>  = () => from(import(/* webpackChunkName: "dexie" */  "dexie")).pipe(
  map(({ default: DexieCtor }) => new DexieCtor(name)),
);

timer(3000).pipe(
  switchMap(() => Dexie$("test")),
).subscribe((db) => {
  console.log(db);
});







