import {Observable} from "rxjs";
import {switchMap, take, tap} from "rxjs/operators";
import {AbstractDataTableInput, DataTableSelectable} from "./DataTableInput";

export class DataTableSelect extends AbstractDataTableInput<DataTableSelectable> {


  private options$: Observable<DataTableSelectable[]>;
  private _options: DataTableSelectable[] = [];

  public appendTo$($cell): Observable<{dirty: boolean, value: DataTableSelectable}> {
    return this.options$.pipe(
      take(1),
      tap((_options: DataTableSelectable[]) => {
        this.njkParams.options = this._options = _options;
        this.$input = $(this.njk.render(this.njkParams));
        this.$htmEl.append(this.$input);
      }),
      switchMap(() => super.appendTo$($cell)),
    );
  }

  public setOptions$(options$: Observable<DataTableSelectable[]>) {
    this.options$ = options$;
  }

  public setValue(value: DataTableSelectable) {
    this.njkParams.value = this.originalValue = value;
  }

  protected getInputValue() {
    const _identifier = this.$input.children("option:selected").val();
    let object = null;
    this._options.forEach((_object: DataTableSelectable) => {
      if (_object.identifier === _identifier) {
        object = _object;
      }
    });
    return object;
  }
}
