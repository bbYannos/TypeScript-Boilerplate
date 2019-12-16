import * as moment from "moment";
import {OperationInterface} from "shared/moment";
import {DATE_FORMAT, DATE_TIME_FORMAT, EDITABLE_TYPES, TIME_FORMAT} from "./Constants";
import {
  AbstractDataTableInput,
  DataTableDateTimeInput,
  DataTableDurationInput,
  DataTableNumberInput,
  DataTableSelect,
  DataTableTextInput,
  DataTableTimeInput,
} from "./Inputs/";
import {DataTableColorPicker} from "./Inputs/DataTableColorPicker";


export class EditableContentManager {
  public static getFormattedValue(value: any, type: number) {
    switch (type) {
      case EDITABLE_TYPES.dateInput :
        return (moment.isMoment(value)) ? value.format(DATE_FORMAT) : "";
      case  EDITABLE_TYPES.dateTimeInput :
        return (moment.isMoment(value)) ? value.format(DATE_TIME_FORMAT) : "";
      case EDITABLE_TYPES.timeInput :
        return (value === null) ? "" : value.format(TIME_FORMAT);
      case EDITABLE_TYPES.durationInput :
        return (value === null) ? "" : value.format(TIME_FORMAT);
      default :
        return value;
    }
  }

  public static getInputByType(type: number, options: { value: any, object?: any, params?: any }): AbstractDataTableInput<any> {
    let input;
    switch (type) {
      case EDITABLE_TYPES.textInput:
        input = new DataTableTextInput();
        input.setValue(options.value);
        return input;
      case EDITABLE_TYPES.numberInput:
        input = new DataTableNumberInput();
        input.setValue(options.value);
        return input;
      case EDITABLE_TYPES.colorPicker:
        input = new DataTableColorPicker();
        input.setValue(options.value);
        return input;
      case EDITABLE_TYPES.dateTimeInput :
      case EDITABLE_TYPES.dateInput :
        input = new DataTableDateTimeInput();
        if (type === EDITABLE_TYPES.dateInput) {
          input.settings.format = DATE_FORMAT;
        }
        input.setValue(options.value);
        const dateOperation = options.object as OperationInterface;
        if (dateOperation && dateOperation.event) {
          input.setLimits(dateOperation.event);
        }
        return input;

      case EDITABLE_TYPES.timeInput :
        input = new DataTableTimeInput();
        input.setValue(options.value);
        return input;

      case EDITABLE_TYPES.durationInput :
        input = new DataTableDurationInput();
        if (options.params && options.params.durationFormat) {
          input.format = options.params.durationFormat;
        }
        input.setValue(options.value);
        return input;

      case EDITABLE_TYPES.select:
        input = new DataTableSelect();
        input.setValue(options.value);
        input.setOptions$(options.params.options$);
        return input;
    }
    return null;
  }
}
