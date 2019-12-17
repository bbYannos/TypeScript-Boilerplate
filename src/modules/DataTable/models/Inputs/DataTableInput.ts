import {fromEvent, Observable, Subject} from "rxjs";
import {map, take} from "rxjs/operators";
import {closeAction, InputComponent} from "./input.component";

export interface DataTableSelectable {
  identifier: string;
  label: string;
}

export abstract class AbstractDataTableInput<T> {
  public keyPressed: string = null;
  protected debug: boolean = false;
  protected value: T;
  protected input: InputComponent = new InputComponent();

  protected close_: Subject<{ dirty: boolean, value: T }> = new Subject<{ dirty: boolean, value: T }>();

  public get close$(): Observable<{ dirty: boolean, value: T, action: closeAction }> {
    return this.input.close_.pipe(
      map((action) => ({
          dirty: this.checkInputValueChange(),
          value: this.stringToValue(this.input.value),
          action: action,
        }),
      ),
    );
  }

  public appendTo($td, value: T) {
    this.value = value;
    this.input.value = this.valueToString(value);
    this.input.$mount();
    $td.append(this.input.$el);
    this.input.$refs.input.focus();
  }

  protected abstract valueToString(value): string;

  protected abstract stringToValue(value: string): T;

  protected checkInputValueChange() {
    return (this.valueToString(this.value) !== this.valueToString(this.input.value));
  }
}

export class DataTableTextInput extends AbstractDataTableInput<string> {
  protected stringToValue(value: string): string {
    return value;
  }

  protected valueToString(value: string): string {
    return value;
  };
}

export class DataTableNumberInput extends AbstractDataTableInput<number> {
  public setValue(value: number) {
    this.originalValue = value;
    if (value) {
      this.$input.val(value.toString());
    } else {
      this.$input.val('');
    }
    this.$htmEl.append(this.$input);
  }

  protected getInputValue(): number {
    if (this.$input.val().toString() === '') {
      return null;
    }
    return Number(this.$input.val().toString());
  }
}
