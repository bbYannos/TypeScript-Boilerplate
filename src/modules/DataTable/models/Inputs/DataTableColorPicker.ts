import $ from "jquery";
import {Observable} from "rxjs";
import "shared/colorpicker";
import {DataTableTextInput} from "./DataTableInput";

export class DataTableColorPicker extends DataTableTextInput {

  // noinspection CssInvalidHtmlTagReference
  public $htmEl: JQuery =
    $('<div class="input-group colorpicker-component"></div>');
  public $btn: JQuery = $('<span class="input-group-append"><span class="input-group-text colorpicker-input-addon"><i></i></span></span>');
  public $input: JQuery =
    $('<input class="form-control" />').attr({type: "text", value: ""});

  public appendTo$($cell): Observable<{ dirty: boolean, value: string }> {
    this.$htmEl.append(this.$input);
    const response$ = super.appendTo$($cell);
    this.$input.off("blur");
    this.$htmEl.colorpicker({}).on("colorpickerHide", () => this.onClose());
    this.$input.trigger("focus");
    return response$;
  }
}
