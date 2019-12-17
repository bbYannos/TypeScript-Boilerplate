import moment from "shared/moment";
import {MIDNIGHT, TIME_FORMAT} from "../../Constants";
import {DataTableDateTimeInput} from "./DataTableDateTimeInput";

export class DataTableTimeInput extends DataTableDateTimeInput {
  public settings = {
    locale: "fr",
    debug: this.debug,
    format: TIME_FORMAT,
    minDate: MIDNIGHT(),
    maxDate: MIDNIGHT().add(1, "day"),
    date: MIDNIGHT().add(moment.duration(2, "hour")),
  };
}
