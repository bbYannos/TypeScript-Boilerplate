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

  public appendTo($td, value: moment.Duration) {
    super.appendTo($td, value);
    const im = new InputMask(this.mask);
    // noinspection TypeScriptValidateJSTypes
    im.mask(this.input.$refs.input);
  }

  protected stringToValue(value: string): moment.Duration {
    switch (this.format) {
      case "mm" :
        return moment.duration(Number(value), "minute");
      case "HH:mm":
        const hours = value.toString().split(":").shift();
        const minutes = value.toString().split(":").pop();
        const start = moment().startOf("day");
        const end = start.clone().add(hours, "hour").add(minutes, "minute");
        return moment.duration(end.diff(start));
      default:
        return moment.duration();
    }
  }

  protected valueToString(value): string {
    if (!moment.isDuration(value)) {
      return "";
    }
    return value.format(this.format);
  }
}
