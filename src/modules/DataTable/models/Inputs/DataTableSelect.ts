import {Observable} from "rxjs";
import {map, take} from "rxjs/operators";
import {closeAction} from "./input.component";
import {SelectableInterface, SelectComponent} from "./select.component";

export class DataTableSelect {
  public options: SelectableInterface[] = null;
  protected input = new SelectComponent();
  protected identifier: string = null;
  protected options$: Observable<SelectableInterface[]>;

  public setOptions$(options$: Observable<SelectableInterface[]>) {
    console.log('SET OPTIONS');
    this.options$ = options$;
  }

  public get close$(): Observable<{ dirty: boolean, value: SelectableInterface, action: closeAction }> {
    return this.input.close_.pipe(
      map((action) => ({
          dirty: this.checkInputValueChange(),
          value: this.input.value,
          action: action,
        }),
      ),
    );
  }

  public appendTo($td, value: SelectableInterface) {
    if (value) {
      this.identifier = value.identifier;
    }
    this.options$.pipe(take(1)).subscribe((options: SelectableInterface[]) => {
      this.input.value = (value) ? {identifier:  value.identifier, label: value.label} : null;
      this.input.options = options;
      this.input.$mount();
      $td.append(this.input.$el);
      this.input.$htmEl.focus();
    });
  }

  protected checkInputValueChange() {
    return (this.input.value.identifier !== this.identifier);
  }
}
