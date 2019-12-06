import {JsonObject, JsonProperty, RelationConverter} from "shared/json2typescript";
import {AbstractApiModel} from "./api.model";

@JsonObject("AbstractSortable")
export abstract class AbstractSortable extends AbstractApiModel {
  @JsonProperty("position", Number, true)
  public sorting: number = 0;

  @JsonProperty("parent", RelationConverter, true)
  public parent: AbstractApiModel = null;

  @JsonProperty("previous", RelationConverter, true)
  public previous: AbstractSortable = null;

  @JsonProperty("next", RelationConverter, true)
  public next: AbstractSortable = null;

  public updateSorting() {
    this.sorting = this.previous !== null ? this.previous.sorting + 1 : 0;
    if (this.next !== null) {
      this.next.updateSorting();
    }
  }

  /**
   * Detach object from his current list
   * Attach his next to his previous
   */
  public detach() {
    if (this.previous !== null) {
      this.previous.next = this.next;
    }
    if (this.next !== null) {
      this.next.previous = this.previous;
      this.next.updateSorting();
    }
    this.parent = null;
    this.previous = null;
    this.next = null;
    this.sorting = 0;
  }

  /**
   * Insert object after previous
   * Attach his next to his previous
   */
  public attach(previous: AbstractSortable) {
    if (this.previous !== null) {
      this.detach();
    }
    this.parent = previous.parent;
    this.previous = previous;
    this.next = previous.next;
    this.updateSorting();
  }
}
