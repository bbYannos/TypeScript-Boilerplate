import {Observable, Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {Component, Prop, Vue, VueComponent} from "shared/vue";
import Router from "vue-router";
import {LoaderComponent} from "../loader";
import WithRender from "./list-wrapper.html";

interface ComponentInterface {
  data: any;
  $router: Router;
  close$: Observable<any>;
  loading_: Observable<boolean>;
  add$: Observable<any>;
  $htmEl: HTMLElement;
  render(): void;
}

@WithRender
@Component({components: {LoaderComponent}})
export class ListWrapper extends Vue implements VueComponent {
  public $refs: { target?: HTMLElement } = {};
  public data: {
    loading: boolean,
    addButtonDisplayed: boolean,
    addButtonLabel: string,
  } = {
    loading: true,
    addButtonDisplayed: false,
    addButtonLabel: "",
  };

  @Prop({default: null})
  public component$: () => Observable<{ default: new () => ComponentInterface }>;

  @Prop({default: () => new Subject<any>()})
  public add_: Subject<any>;

  protected close_: Subject<void> = new Subject<void>();

  public mounted() {
    this.component$().subscribe(({default: _Component}) => {
      const component = new _Component();
      this.data = {...this.data, ...component.data};
      component.loading_.pipe(takeUntil(this.close_)).subscribe((loading: boolean) => this.data.loading = loading);
      component.$htmEl = this.$refs.target;
      component.$router = this.$router;
      component.close$ = this.close_.asObservable();
      component.add$ = this.add_.asObservable();
      component.render();
    });
  }

  public beforeDestroy() {
    this.close_.next();
    this.close_.complete();
  }
}

export default Vue.component("list-w", ListWrapper);
