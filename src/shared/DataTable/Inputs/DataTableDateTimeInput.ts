import {ObjectUtils} from "shared/utils/object.utils";
import {Observable} from "rxjs";
import moment, {EventInterface} from "shared/moment";
import {DATE_TIME_FORMAT} from "../Constants";
import {AbstractDataTableInput} from "./DataTableInput";

export class DataTableDateTimeInput extends AbstractDataTableInput<moment.Moment> {
  public $input: JQuery =
    $('<input type="text" class="form-control datetimepicker-input" id="dateTimePicker" data-target="#dateTimePicker"/>');
  public settings = {
    locale: "fr",
    debug: this.debug,
    format: DATE_TIME_FORMAT,
    date: null,
  };
  protected dateTimePicker: any;

  public setLimits(event: EventInterface) {
    this.settings.minDate = event.startTime;
    this.settings.maxDate = event.endTime;
  }

  public setValue(value: moment.Moment) {
    if (!ObjectUtils.isValidMoment(value)) {
      value = moment().startOf("day");
    }
    this.originalValue = value.clone();
    this.settings.date = value.clone();
    this.$input.val(this.settings.date.format(this.settings.format));
  }

  public appendTo$($cell): Observable<{dirty: boolean, value: moment.Moment}> {
    this.$input.val(this.settings.date.format(this.settings.format));
    this.$htmEl.append(this.$input);
    this.$input.datetimepicker(this.settings);
    const response$ = super.appendTo$($cell);
    this.dateTimePicker = this.$input.data("datetimepicker");
    this.dateTimePicker.show();
    return response$;
  }

  protected getInputValue() {
    const _date = this.$input.data("date");
    let time = this.dateTimePicker.getMoment(_date);
    if (!(ObjectUtils.isValidMoment(time) && time.isValid())) {
      time = null;
    }
    return time;
  }

  protected checkInputValueChange() {
    if (this.getInputValue() === null) {
      return true;
    }
    return (!(this.getInputValue().format(this.settings.format) === this.originalValue.format(this.settings.format)));
  }
}
