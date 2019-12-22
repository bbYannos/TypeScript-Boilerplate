import $ from "jquery";
import {EditableContentManager} from "modules/DataTable/models/Inputs/EditableContent.manager";
import Vue from "vue";
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";
import WithRender from "./form.editable.html";

@WithRender
@Component
export class FormEditable extends Vue {

  @Prop({default: null})
  public data: {
    value: any,
    type: number,
  };

  public displayedValue: string = "";
  public created() {
    this.displayedValue = EditableContentManager.getFormattedValue(this.data.value, this.data.type);
  }

  public injectInput() {
    if (this.$el.classList.contains("to_edit")) {
      return;
    }
    this.$el.classList.add("to_edit");
    const $el = $(this.$el);
    const input = EditableContentManager.getInputByType(this.data.type);
    input.appendTo($el, this.data.value);
    input.close$.subscribe((res) => {
      if (res.dirty) {
        this.data.value = res.value;
        this.displayedValue = EditableContentManager.getFormattedValue(this.data.value, this.data.type);
        this.$emit("valueChange", res.value);
      }
      this.$el.classList.remove("to_edit");
    });
  }
}

export default Vue.component("form-editable", FormEditable);
