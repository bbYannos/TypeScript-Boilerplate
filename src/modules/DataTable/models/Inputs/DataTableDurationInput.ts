import InputMask from "inputmask";
import moment from "shared/moment";
import {AbstractDataTableInput} from "./DataTableInput";

export class DataTableDurationInput extends AbstractDataTableInput<moment.Duration> {
  public format = "HH:mm";

  public get mask() {
    switch (this.format) {
      case "mm" :
        return "9{1,3}";
      case "HH:mm":
      default:
        return "9{1,3}:[99]";
    }
  }

  public setValue(value: moment.Duration) {
    if (!moment.isDuration(value)) {
      value = moment.duration(0);
    }
    this.originalValue = value;
    this.$input.val(value.format(this.format));
    const im = new InputMask(this.mask);
    // noinspection TypeScriptValidateJSTypes
    im.mask(this.$input.get(0));
    this.$htmEl.append(this.$input);
  }

  protected getInputValue() {
    switch (this.format) {
      case "mm" :
        return moment.duration(Number(this.$input.val()), "minute");
      case "HH:mm":
        const hours = this.$input.val().toString().split(":").shift();
        const minutes = this.$input.val().toString().split(":").pop();
        const start = moment().startOf("day");
        const end = start.clone().add(hours, "hour").add(minutes, "minute");
        return moment.duration(end.diff(start));
      default:
        return moment.duration();
    }
  }

  protected checkInputValueChange() {
    return (this.originalValue.format(this.format) !== this.getInputValue().format(this.format));
  }
}
