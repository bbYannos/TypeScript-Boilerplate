import "assets/vendor/typeaheadjs.scss";
import {from, Observable} from "rxjs";
import {Component, Prop, Vue, VueComponent} from "shared/vue";
import {LabeledInterface} from "../../shared/abstract-api/classes/models";
import "./input-clearable.css";
import WithRender from "./input-clearable.html";

interface AutocompleteManagerInterface<T extends LabeledInterface> {
  selectItem$: Observable<T>;
  init(input: HTMLInputElement, source$: (searchedString) => Observable<any>);
  destroy(): void;
  reset(): void;
}

@WithRender
@Component
export class InputClearable extends Vue implements VueComponent {
  @Prop({default: ""})
  public placeholder;

  @Prop({default: ""})
  public originalValue;

  @Prop({default: null})
  public source$: (searchedString) => Observable<any>;

  public value: string = "";

  public $refs: {input: HTMLInputElement} = {input: null};

  protected autocompleteManager: AutocompleteManagerInterface<any> = null;
  protected autocompleteManager$ = () =>  from(import(/* webpackChunkName: "jquery" */ "./autocomplete.manager"));

  public loaded(): void {
    this.value = this.originalValue;
  }

  public mounted(): void {
    if (this.source$ !== null) {
      this.autocompleteManager$().subscribe(({default: AutocompleteManager}) => {
        this.autocompleteManager = new AutocompleteManager<any>();
        this.autocompleteManager.init(this.$refs.input, this.source$);
        this.autocompleteManager.selectItem$.subscribe((item) => {
          this.$emit("selectedItem", item);
          this.reset();
        });
      });
    }
  }

  public beforeDestroy(): void {
    if (this.autocompleteManager !== null) {
      this.autocompleteManager.destroy();
    }
  }
  
  public reset() {
    this.value = "";
    if (this.autocompleteManager !== null) {
      this.autocompleteManager.reset();
    }
  }
}

export default Vue.component("input-clearable", InputClearable);
