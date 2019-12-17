import {from} from "rxjs";
import {shareReplay} from "rxjs/operators";


// export const calendarModule$ = timer(2000).pipe(
//  switchMap(() => from(import(/* webpackChunkName: "full-calendar" */ "./module"))),
//  shareReplay(1),
// );

export const calendarModule$ = from(import(/* webpackChunkName: "full-calendar" */ "./module")).pipe(
  shareReplay(1),
);
