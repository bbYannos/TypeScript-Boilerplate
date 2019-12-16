import {fromEvent, Observable, Subject} from "rxjs";
import {take} from "rxjs/operators";

export interface DataTableSelectable {
  identifier: string;
  label: string;
}

export abstract class AbstractDataTableInput<T> {
  public keyPressed: string = null;

  public $htmEl: JQuery =
    $('<div class="dataTable-input"></div>');
  public $input: JQuery =
    $('<input class="form-control" />').attr({type: "text", value: ""});
  protected debug: boolean = false;
  protected njk = require("./DataTableInputs.njk");
  protected originalValue: T;

  protected close_: Subject<{dirty: boolean, value: T}> = new Subject<{dirty: boolean, value: T}>();
  protected keyboard$ub;

  public abstract setValue(value: T);

  public appendTo$($cell): Observable<{dirty: boolean, value: T}> {
    $cell.append(this.$htmEl);
    this.$input.off("blur");
    this.$input.on("blur", (e) => {
      this.onClose();
    });
    this.$input.trigger("focus");
    this.takeKeyboard();
    return this.close_.asObservable().pipe(take(1));
  }

  protected takeKeyboard() {
    this.keyboard$ub = fromEvent(this.$input.get(0), "keydown").subscribe((event: KeyboardEvent) => {
      if (event.key === "Tab" || event.key === "Enter") {
        event.preventDefault();
        this.keyPressed = event.key;
        this.$input.trigger("blur");
      }
    });
  }

  protected onClose() {
    if (!this.debug) {
      this.$input.off("blur");
      this.close_.next({dirty: this.checkInputValueChange(), value: this.getInputValue()});
      this.close_.complete();
      this.keyboard$ub.unsubscribe();
      this.$htmEl.remove();
    }
  }

  protected checkInputValueChange() {
    return (this.getInputValue() !== this.originalValue);
  }

  protected abstract getInputValue(): T;
}

export class DataTableTextInput extends AbstractDataTableInput<string> {
  public setValue(value: string) {
    this.originalValue = value;
    this.$input.val(value as string);
    this.$htmEl.append(this.$input);
  }

  protected getInputValue(): string {
    return this.$input.val().toString();
  }
}

export class DataTableNumberInput extends AbstractDataTableInput<number> {
  public setValue(value: number) {
    this.originalValue = value;
    if (value) {
      this.$input.val(value.toString());
    } else {
      this.$input.val("");
    }
    this.$htmEl.append(this.$input);
  }

  protected getInputValue(): number {
    if (this.$input.val().toString() === "") {
      return null;
    }
    return Number(this.$input.val().toString());
  }
}
