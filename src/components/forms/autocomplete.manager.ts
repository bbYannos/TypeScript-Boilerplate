import $ from "jquery";
import {Observable, Subject, Subscription, timer} from "rxjs";
import {LabeledInterface} from "shared/abstract-api/classes/models";
import "typeahead.js";

export class AutocompleteManager<T extends LabeledInterface> {
  protected selectItem_: Subject<T> = new Subject<T>();
  public selectItem$ = this.selectItem_.asObservable();
  public options: Twitter.Typeahead.Options = {
    hint: true,
    highlight: true,
    minLength: 1,
  };

  protected $input: JQuery = null;
  protected dataSet: Twitter.Typeahead.Dataset<T> = {
    limit: 10,
    source: (query, syncResults, asyncResults) => {
      if (this.current$ub !== null) {
        this.current$ub.unsubscribe();
        this.current$ub = null;
      }
      if (this.source$ === null) {
        timer(100).subscribe(() => {
          throw Error("No source$ defined for AutoComplete");
        });
      } else {
        this.current$ub = this.source$(query).subscribe((objects: T[]) => {
          // Warning : seems using async or sync depends on delay before emit
          syncResults(objects);
          // asyncResults(objects);
        });
      }
    },
    display: (object: T) => object.label,
  };

  protected source$: (searchedString) => Observable<any> = null;
  protected current$ub: Subscription = null;

  public init($inputEl: HTMLInputElement, source$: (searchedString) => Observable<any>): void {
    this.$input = $($inputEl);
    this.source$ = source$;
    this.$input.typeahead<T>(this.options, this.dataSet);
    this.$input.on("typeahead:select", (ev, object: T) => {
      this.selectItem_.next(object);
    });
  }

  public reset() {
    this.$input.typeahead("val", "");
  }
  
  public destroy() {
    this.$input.off("typeahead:select");
    this.$input.typeahead("destroy");
    this.selectItem_.complete();
  }
}

export default AutocompleteManager;
