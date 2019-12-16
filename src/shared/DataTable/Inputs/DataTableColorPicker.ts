import "bootstrap-colorpicker/dist/css/bootstrap-colorpicker.css";
import "bootstrap-colorpicker/dist/js/bootstrap-colorpicker.js";
import {Observable} from "rxjs";
// noinspection TypeScriptPreferShortImport
import {DataTableTextInput} from "./DataTableInput";

export class DataTableColorPicker extends DataTableTextInput {

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
