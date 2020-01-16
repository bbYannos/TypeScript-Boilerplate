import {Observable} from "rxjs";
import {OperationInterface} from "shared/moment";
import {DATE_FORMAT, EDITABLE_TYPES} from "../Constants";
import {
  AbstractDataTableInput,
  DataTableColorPicker,
  DataTableDateTimeInput,
  DataTableDurationInput,
  DataTableNumberInput,
  DataTableSelect,
  DataTableTextInput,
  DataTableTimeInput,
} from "./Inputs";
import {SelectableInterface} from "./Inputs/select.component";

export class Column {
  public input: AbstractDataTableInput<any> = null;
  public index: number;

  constructor(
    public display: any,
    public type: number = -1,
    public params: {
      options$?: Observable<SelectableInterface[]>,
      emptyLabel?: string,
      max?: any,
      min?: any,
      durationFormat?: string,
      editedObject?: (...param) => any,
      editedValue?: string,
      updateAction?: (...param) => Observable<any>;
    } = null) {
  }

  public getInput(object: any = null): AbstractDataTableInput<any> {
    let input;
    switch (this.type) {
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
        if (this.type === EDITABLE_TYPES.dateInput) {
          input.settings.format = DATE_FORMAT;
        }
        const dateOperation = object as OperationInterface;
        if (dateOperation && dateOperation.event) {
          input.setLimits(dateOperation.event);
        }
        return input;

      case EDITABLE_TYPES.timeInput :
        input = new DataTableTimeInput();
        return input;

      case EDITABLE_TYPES.durationInput :
        input = new DataTableDurationInput();
        if (this.params && this.params.durationFormat) {
          input.format = this.params.durationFormat;
        }
        return input;

      case EDITABLE_TYPES.select:
        input = new DataTableSelect();
        input.setOptions$(this.params.options$);
        return input;
    }
    return null;
  }
}
