import {Subject} from "rxjs";
import Vue from "vue";
import Component from "vue-class-component";
import {closeAction} from "./input.component";
import WithRender from "./select.component.html";

export interface SelectableInterface {
  identifier: string;
  label: string;
}

@WithRender
@Component
export class SelectComponent extends Vue {
  public $refs: {
    select?: HTMLSelectElement,
  } = {};
  public options: SelectableInterface[] = [];
  public selected: string = null;
  public defaultLabel: string = "";

  public close_: Subject<closeAction> = new Subject<closeAction>();

  public get value() {
    return this.options.find((option) => option.identifier === this.selected) || ({identifier: null, label: null});
  }

  public set value(value: SelectableInterface) {
    if (value) {
      this.selected = value.identifier;
    }
  }

  public get $htmEl() {
    return this.$refs.select;
  }

  public onKeyDown(event) {
    if (event.key === "Tab" || event.key === "Enter") {
      event.preventDefault();
      this.close(event.key);
    }
  }

  public close(action: ("Tab" | "Enter" | "Blur")) {
    this.close_.next(action);
    this.close_.complete();
    this.$el.remove();
    this.$destroy();
  }
}
