import {Observable, Subject} from "rxjs";
import Vue from "vue";
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";
import Router from "vue-router";
import WithRender from "./list-wrapper.html";

interface ComponentInterface {
  data: any;
  $router: Router;
  close$: Observable<any>;
  add$: Observable<any>;
  $htmEl: HTMLElement;
  render(): void;
}

@WithRender
@Component
export class ListWrapper extends Vue {
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
  protected close_: Subject<void> = new Subject<void>();
  protected add_: Subject<void> = new Subject<void>();

  // noinspection JSUnusedGlobalSymbols
  public mounted() {
    this.component$().subscribe(({default: _Component}) => {
      const component = new _Component();
      this.data = {...this.data, ...component.data};
      component.$htmEl = this.$refs.target;
      component.$router = this.$router;
      component.close$ = this.close_.asObservable();
      component.add$ = this.add_.asObservable();
      component.render();
    });
  }

  // noinspection JSUnusedGlobalSymbols
  public beforeDestroy() {
    this.close_.next();
    this.close_.complete();
  }
}

export default Vue.component("list-w", ListWrapper);
