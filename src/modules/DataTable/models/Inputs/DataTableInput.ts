import {Observable, Subject} from "rxjs";
import {map} from "rxjs/operators";
import Vue from "vue";
import {closeAction, InputComponent} from "./input.component";

export interface InputInterface extends Vue {
  close_: Subject<closeAction>;
  value: string;
  $htmEl: HTMLElement;
  $value: string;
}

export abstract class AbstractDataTableInput<T> {
  protected debug: boolean = false;
  protected value: T;
  protected input: InputInterface = new InputComponent();

  public get close$(): Observable<{ dirty: boolean, value: T, action: closeAction }> {
    return this.input.close_.pipe(
      map((action) => ({
          dirty: this.checkInputValueChange(),
          value: this.stringToValue(this.input.$value),
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
    this.input.$htmEl.focus();
  }

  protected abstract valueToString(value: T): string;

  protected abstract stringToValue(value: string): T;

  protected checkInputValueChange() {
    return (this.valueToString(this.value) !== this.input.$value);
  }
}

// tslint:disable-next-line
export class DataTableTextInput extends AbstractDataTableInput<string> {
  protected stringToValue(value: string): string {
    return value;
  }

  protected valueToString(value: string): string {
    return value;
  }
}

// tslint:disable-next-line:max-classes-per-file
export class DataTableNumberInput extends AbstractDataTableInput<number> {
  protected stringToValue(value: string): number {
    if (value === "") {
      return null;
    }
    return Number(value);
  }

  protected valueToString(value): string {
    if (!value) {
      return "";
    }
    return value.toString();
  }
}
