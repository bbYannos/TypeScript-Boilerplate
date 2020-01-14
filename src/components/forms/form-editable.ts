import $ from "jquery";
import {EditableContentManager} from "modules/DataTable/models/Inputs/EditableContent.manager";
import {Component, Prop, Vue, VueComponent} from "shared/vue";
import WithRender from "./form-editable.html";

@WithRender
@Component
export class FormEditable extends Vue implements VueComponent {

  @Prop({default: null})
  public value: any;

  @Prop({default: null})
  public type: number;

  public get displayedValue(): string {
    if (this.value !== null && this.type !== null) {
      return EditableContentManager.getFormattedValue(this.value, this.type);
    }
    return null;
  }

  public injectInput() {
    if (this.$el.classList.contains("to_edit")) {
      return;
    }
    this.$el.classList.add("to_edit");
    const $el = $(this.$el);
    const input = EditableContentManager.getInputByType(this.type);
    input.appendTo($el, this.value);
    input.close$.subscribe((res) => {
      if (res.dirty) {
        this.$emit("valueChange", res.value);
      }
      this.$el.classList.remove("to_edit");
    });
  }
}

export default Vue.component("form-editable", FormEditable);
