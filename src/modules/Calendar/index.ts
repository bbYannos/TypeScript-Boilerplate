import {from, timer} from "rxjs";
import {shareReplay, switchMap} from "rxjs/operators";

export const calendarModule$ = timer(5000).pipe(
  switchMap(() => from(import(/* webpackChunkName: "full-calendar" */ "./module"))),
  shareReplay(1),
);
