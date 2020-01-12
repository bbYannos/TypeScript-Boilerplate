import {BehaviorSubject, Observable, Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {Component, Prop, Vue, VueComponent} from "shared/vue";

import {LoaderComponent} from "../loader";
import WithRender from "./calendar-wrapper.html";

interface ComponentInterface {
  loading_: BehaviorSubject<boolean>;
  render(): void;
}

@WithRender
@Component({components: {LoaderComponent}})
export class CalendarWrapper extends Vue implements VueComponent {
  public $refs: { target?: HTMLElement } = {};
  public data: { loading: boolean } = {loading: true};
  @Prop({default: null})
  public component$: () => Observable<{ default: new ($htmEl: HTMLElement, close$: Observable<void>) => ComponentInterface }>;
  @Prop({default: null})
  public params: any;
  protected close_: Subject<void> = new Subject<void>();

  public mounted() {
    this.component$().subscribe((module) => {
      const CalendarComponent = module.default;
      const $htmEl = this.$refs.target as HTMLElement;
      const close$ = this.close_.asObservable();
      const component = new CalendarComponent($htmEl, close$);
      component.loading_.pipe(takeUntil(this.close_)).subscribe((loading: boolean) => this.data.loading = loading);
      for (const key in this.params) {
        // noinspection JSUnfilteredForInLoop
        component[key] = this.params[key];
      }
      component.render();
    });
  }

  public beforeDestroy() {
    this.close_.next();
    this.close_.complete();
  }
}

export default Vue.component("calendar-w", CalendarWrapper);
