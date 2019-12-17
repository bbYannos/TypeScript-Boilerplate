import * as moment from "moment";
import {Observable} from "rxjs";
import {MIDNIGHT, TIME_FORMAT} from "../../Constants";
import {AbstractDataTableInput} from "./DataTableInput";

export class DataTableTimeInput extends AbstractDataTableInput<moment.Moment> {

  public $input: JQuery =
    $('<input type="text" class="form-control datetimepicker-input" id="dateTimePicker" data-target="#dateTimePicker"/>');
  public settings = {
    locale: "fr",
    debug: this.debug,
    format: TIME_FORMAT,
    minDate: MIDNIGHT(),
    maxDate: MIDNIGHT().add(1, "day"),
    date: MIDNIGHT().add(moment.duration(2, "hour")),
  };
  protected dateTimePicker: any;

  public setValue(value: moment.Moment) {
    this.originalValue = value.clone();
    this.$input.val(value.format(TIME_FORMAT));
    this.settings.date = value;
  }

  public appendTo$($cell): Observable<{dirty: boolean, value: moment.Moment}> {
    const response$ = super.appendTo$($cell);
    this.$htmEl.append(this.$input);
    this.$input.datetimepicker(this.settings);
    this.dateTimePicker = this.$input.data("datetimepicker");
    this.dateTimePicker.show();
    return response$;
  }

  protected getInputValue(): moment.Moment {
    const _date = this.$input.data("date");
    return this.dateTimePicker.getMoment(_date);
  }

  protected checkInputValueChange() {
    return (!this.originalValue.isSame(this.getInputValue()));
  }
}
