import $ from "jquery";
import moment, {EventInterface} from "shared/moment";
import {ObjectUtils} from "shared/utils/object.utils";
import "tempusdominus-bootstrap-4";
import "tempusdominus-bootstrap-4/build/css/tempusdominus-bootstrap-4.min.css";
import {DATE_TIME_FORMAT} from "../../Constants";
import {AbstractDataTableInput} from "./DataTableInput";

export class DataTableDateTimeInput extends AbstractDataTableInput<moment.Moment> {
  public settings: {
    locale: string,
    debug: boolean,
    format: string,
    date: moment.Moment,
    minDate?: moment.Moment,
    maxDate?: moment.Moment,
  } = {
    locale: "fr",
    debug: true,
    format: DATE_TIME_FORMAT,
    date: null,
  };
  protected dateTimePicker: any;

  public setLimits(event: EventInterface) {
    this.settings.minDate = event.startTime;
    this.settings.maxDate = event.endTime;
  }

  public appendTo($td, value: moment.Moment) {
    super.appendTo($td, value);
    this.input.$refs.input.setAttribute("data-target", "#dateTimePicker");
    this.input.$refs.input.setAttribute("id", "dateTimePicker");
    if (!(ObjectUtils.isValidMoment(value))) {
      value = moment();
    }
    this.settings.date = value.clone();
    $(this.input.$refs.input).datetimepicker(this.settings);
    $(this.input.$refs.input).data("datetimepicker").show();
  }

  protected stringToValue(value: string): moment.Moment {
    const dateTime = moment(value, this.settings.format);
    if (!(ObjectUtils.isValidMoment(dateTime))) {
      return null;
    }
    return dateTime;
  }

  protected valueToString(value: moment.Moment): string {
    if (!(ObjectUtils.isValidMoment(value))) {
      return "";
    }
    return value.format(this.settings.format);
  }
}
