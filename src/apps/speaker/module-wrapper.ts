import {Observable, Subject} from "rxjs";
import Vue from "vue";
import Component from "vue-class-component";
import WithRender from "./module-wrapper.html";


interface ModuleComponent {
  close$: Observable<void>;
  $htmEl: HTMLElement;
  render(...param): void;
}

@WithRender
@Component
export class ModuleWrapper extends Vue {
  protected close_: Subject<void> = new Subject<void>();

  public loadComponent(component: ModuleComponent) {
    component.close$ = this.close_;
    component.$htmEl = this.$el as HTMLElement;
  }

  // noinspection JSUnusedGlobalSymbols
  public beforeDestroy() {
    this.close_.next();
    this.close_.complete();
  }
}
