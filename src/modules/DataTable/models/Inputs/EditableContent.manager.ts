import moment, {OperationInterface} from "shared/moment";
import {DATE_FORMAT, DATE_TIME_FORMAT, EDITABLE_TYPES, TIME_FORMAT} from "../../Constants";
import {DataTableColorPicker} from "./DataTableColorPicker";
import {DataTableDateTimeInput} from "./DataTableDateTimeInput";
import {DataTableDurationInput} from "./DataTableDurationInput";
import {AbstractDataTableInput, DataTableNumberInput, DataTableTextInput} from "./DataTableInput";
import {DataTableSelect} from "./DataTableSelect";
import {DataTableTimeInput} from "./DataTableTimeInput";


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

  public static getInputByType(type: number, options: { object?: any, params?: any } = {}): AbstractDataTableInput<any> {
    let input;
    switch (type) {
      case EDITABLE_TYPES.textInput:
        input = new DataTableTextInput();
        return input;
      case EDITABLE_TYPES.numberInput:
        input = new DataTableNumberInput();
        return input;
      case EDITABLE_TYPES.colorPicker:
        input = new DataTableColorPicker();
        return input;
      case EDITABLE_TYPES.dateTimeInput :
      case EDITABLE_TYPES.dateInput :
        input = new DataTableDateTimeInput();
        if (type === EDITABLE_TYPES.dateInput) {
          input.settings.format = DATE_FORMAT;
        }
        const dateOperation = options.object as OperationInterface;
        if (dateOperation && dateOperation.event) {
          input.setLimits(dateOperation.event);
        }
        return input;

      case EDITABLE_TYPES.timeInput :
        input = new DataTableTimeInput();
        return input;

      case EDITABLE_TYPES.durationInput :
        input = new DataTableDurationInput();
        if (options.params && options.params.durationFormat) {
          input.format = options.params.durationFormat;
        }
        return input;

      case EDITABLE_TYPES.select:
        input = new DataTableSelect();
        input.setOptions$(options.params.options$);
        return input;
    }
    return null;
  }
}
