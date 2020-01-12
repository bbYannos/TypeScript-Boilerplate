import {BehaviorSubject, Observable, Subject} from "rxjs";
import {takeUntil, tap} from "rxjs/operators";
import Vue from "vue";
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";
import {LoaderComponent} from "../loader";
import WithRender from "./calendar-wrapper.html";

interface ComponentInterface {
  loading_: BehaviorSubject<boolean>;
  render(): void;
}

@WithRender
@Component({components: {LoaderComponent}})
export class CalendarWrapper extends Vue {
  public $refs: { target?: HTMLElement } = {};
  public data: { loading: boolean } = {loading: true};
  @Prop({default: null})
  public component$: () => Observable<{ default: new ($htmEl: HTMLElement, close$: Observable<void>) => ComponentInterface }>;
  @Prop({default: null})
  public params: any;
  protected close_: Subject<void> = new Subject<void>();

  // noinspection JSUnusedGlobalSymbols
  public mounted() {
    this.component$().subscribe((module) => {
      const CalendarComponent = module.default;
      const $htmEl = this.$refs.target as HTMLElement;
      const close$ = this.close_.asObservable().pipe(
        tap(() => console.log("calendar closed")),
      );
      const component = new CalendarComponent($htmEl, close$);
      component.loading_.pipe(takeUntil(this.close_)).subscribe((loading: boolean) => this.data.loading = loading);
      for (const key in this.params) {
        component[key] = this.params[key];
      }
      component.render();
    });
  }

  // noinspection JSUnusedGlobalSymbols
  public beforeDestroy() {
    this.close_.next();
    this.close_.complete();
  }
}

export default Vue.component("calendar-w", CalendarWrapper);
