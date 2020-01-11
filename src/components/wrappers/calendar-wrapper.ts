import {Observable, Subject} from "rxjs";
import {tap} from "rxjs/operators";
import Vue from "vue";
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";
import WithRender from "./component-wrapper.html";

interface ComponentInterface {
  render(): void;
}

@WithRender
@Component
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
      this.data.loading = false;
      const $htmEl = this.$refs.target as HTMLElement;
      const close$ = this.close_.asObservable().pipe(
        tap(() => console.log("calendar closed")),
      );
      const component = new CalendarComponent($htmEl, close$);
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
