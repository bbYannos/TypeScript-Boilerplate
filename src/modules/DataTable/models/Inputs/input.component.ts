import {fromEvent, Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import Vue from "vue";
import Component from "vue-class-component";
import WithRender from "./input.component.html";
export type closeAction = ("Tab" | "Enter" | "Blur");

@WithRender
@Component
export class InputComponent extends Vue {
  public $refs: {
    input?: HTMLInputElement,
  } = {};
  public value: string = "";

  public close_: Subject<closeAction> = new Subject<closeAction>();

  public mounted() {
    fromEvent(this.$refs.input, "keydown").pipe(takeUntil(this.close_)).subscribe((event: KeyboardEvent) => {
      if (event.key === "Tab" || event.key === "Enter") {
        event.preventDefault();
        this.close(event.key);
      }
    });
  }

  public close(action: ("Tab" | "Enter" | "Blur")) {
    this.close_.next(action);
    this.close_.complete();
    this.$el.remove();
    this.$destroy();
  }
}
