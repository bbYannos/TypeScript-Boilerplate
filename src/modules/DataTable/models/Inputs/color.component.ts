import Vue from "vue";
import Component from "vue-class-component";
import WithRender from "./color.component.html";

@WithRender
@Component
export class ColorComponent extends Vue {
  public $refs: {
    input?: HTMLInputElement,
  } = {};
  public value: string = "";

  public get $htmEl() {
    return this.$refs.input;
  }

  public get $value() {
    return this.$refs.input.value;
  }
}
