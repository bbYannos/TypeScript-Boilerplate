import {Subject, timer} from "rxjs";
import "shared/colorpicker";
import "./color.css";
import {closeAction} from "./input.component";

export class DataTableColorPicker {
  public close_: Subject<{ dirty: boolean, value: string, action: closeAction }> = new Subject<{dirty: boolean, value: string, action: closeAction}>();
  protected value: string = null;
  protected $td: JQuery<HTMLElement> = null;
  public get close$() {
    return this.close_.asObservable();
  }

  public appendTo($td, value: string) {
    this.value = value;
    this.$td = $td;
    const options = {
      fallbackColor: "#000000",
      inline: true,
      container: true,
      color: value,
      format: "hex",
      useAlpha: false,
    };
    const display = $td.find(".color-display");
    $td.colorpicker(options).on("colorpickerChange", (event: any) => {
      display.css("background-color", event.color.string("hex"));
    });
    $td.find(".colorpicker").on("click", (e) => {
      e.stopPropagation();
    });
    $td.colorpicker("show");
    timer(100).subscribe(() => {
      document.addEventListener("click", this.manageClick);
    });
  }

  public manageClick = (e) => {
    document.removeEventListener("click", this.manageClick);
    const value = this.$td.colorpicker("getValue", this.value);
    this.$td.colorpicker("destroy");
    this.close_.next({dirty: value !== this.value, value: value, action: "Blur"});
    this.close_.complete();
  }
}
