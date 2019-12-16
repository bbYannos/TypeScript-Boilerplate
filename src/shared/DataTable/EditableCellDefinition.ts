import {Observable} from "rxjs";
import {AbstractDataTableInput, DataTableSelectable} from "./Inputs";

export class EditableCellDefinition {

  public input: AbstractDataTableInput<any> = null;

  constructor(
    public index: number,
    public type: number,
    public params: {
      options$?: Observable<DataTableSelectable[]>,
      emptyLabel?: string,
      max?: any,
      min?: any,
      durationFormat?: string,
    } = null) {
  }
}
