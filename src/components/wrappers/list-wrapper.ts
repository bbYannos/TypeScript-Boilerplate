import {Observable, Subject} from "rxjs";
import Vue from "vue";
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";
import WithRender from "./component-wrapper.html";

interface ComponentInterface {
  close$: Observable<any>;
  $htmEl: HTMLElement;
  setDataSource$(source$: Observable<any>): void;
}

@WithRender
@Component
export class ListWrapper extends Vue {
  public $refs: { target?: HTMLElement } = {};
  public data: { loading: boolean } = {loading: true};
  @Prop({default: null})
  public component$: () => Observable<{ default: { CalendarComponent: new () => ComponentInterface } }>;
  protected close_: Subject<void> = new Subject<void>();

  // noinspection JSUnusedGlobalSymbols
  public mounted() {
    this.component$().subscribe((module) => {
      const CalendarComponent = module.default.CalendarComponent;
      this.data.loading = false;
      const component = new CalendarComponent();
      component.$htmEl = this.$refs.target as HTMLElement;
      component.close$ = this.close_.asObservable();
      component.setDataSource$(null);
    });
  }

  // noinspection JSUnusedGlobalSymbols
  public beforeDestroy() {
    this.close_.next();
    this.close_.complete();
  }
}

export default Vue.component("calendar-w", ListWrapper);
