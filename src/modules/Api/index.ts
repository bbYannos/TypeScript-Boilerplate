import {from} from "rxjs";
import {shareReplay} from "rxjs/operators";

export const apiModule$ = from(import(/* webpackChunkName: "full-calendar" */ "./Api.module")).pipe(
  shareReplay(1),
);
