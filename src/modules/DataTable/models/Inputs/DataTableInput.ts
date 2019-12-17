import {Observable} from "rxjs";
import {map, tap} from "rxjs/operators";
import {closeAction, InputComponent} from "./input.component";

export interface DataTableSelectable {
  identifier: string;
  label: string;
}

export abstract class AbstractDataTableInput<T> {
  protected debug: boolean = false;
  protected value: T;
  protected input: InputComponent = new InputComponent();

  public get close$(): Observable<{ dirty: boolean, value: T, action: closeAction }> {
    return this.input.close_.pipe(
      map((action) => ({
          dirty: this.checkInputValueChange(),
          value: this.stringToValue(this.inputValue),
          action: action,
        }),
      ),
    );
  }

  public get inputValue(): string {
    return this.input.$refs.input.value;
  }

  public appendTo($td, value: T) {
    this.value = value;
    this.input.value = this.valueToString(value);
    this.input.$mount();
    $td.append(this.input.$el);
    this.input.$refs.input.focus();
  }

  protected abstract valueToString(value: T): string;

  protected abstract stringToValue(value: string): T;

  protected checkInputValueChange() {
    return (this.valueToString(this.value) !== this.inputValue);
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
  protected stringToValue(value: string): number {
    return Number(value);
  }

  protected valueToString(value): string {
    return value.toString();
  }
}
