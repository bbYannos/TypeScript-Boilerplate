import {Observable, of} from "rxjs";
import {map, share} from "rxjs/operators";
import {CellClick} from "./CellClick.Base";
import {EditableCellDefinition} from "./EditableCellDefinition";
import {EditableContentManager} from "./EditableContent.manager";


export class EditableCellClick extends CellClick {

  public static fromRowAndColIndex(rowIndex, colIndex, dataTableApi): EditableCellClick {
    const $row = this.get$RowAtIndex(rowIndex, dataTableApi);
    const $cell = $($row.find(" > td").toArray()[colIndex]);
    if ($cell.length > 0) {
      return new EditableCellClick($cell, dataTableApi);
    }
    return null;
  }

  public definition: EditableCellDefinition = null;

  // Open input and return Observable of changes
  public getCellUpdated$(definition: EditableCellDefinition): Observable<{dirty: boolean, cellClick: EditableCellClick, keyPressed?: string}> {
    this.definition = definition;
    let cellUpdated$: Observable<{dirty: boolean, cellClick: EditableCellClick}> = null;
    if (!this.editable) {
      return null;
    }

    if (this.pageNum !== null) {
      // noinspection TypeScriptValidateJSTypes
      this.dataTableApi.page(this.pageNum).draw(false);
    }
    this.$td.addClass("to_edit");
    const options = {value: this.value, object: this.object, params: this.definition.params};
    const input = EditableContentManager.getInputByType(this.definition.type, options);

    if (input !== null) {
      cellUpdated$ = input.appendTo$(this.$td).pipe(
        map(({dirty: dirty, value: value}: {dirty: boolean, value: any}) => {
          this.$td.removeClass("to_edit");
          if (dirty) {
            // Warning : DataTable updates object value and launch list updates !
            this.updateDisplayedValue(value);
          }
          return {dirty: dirty, cellClick: this, keyPressed: input.keyPressed};
        }),
        share(),
      );
    } else {
      // no input: direct update value
      const value = !this.object[this.property];
      this.$td.removeClass("to_edit");
      this.updateDisplayedValue(value);
      cellUpdated$ = of({dirty: true, cellClick: this});
    }
    return cellUpdated$;
  }

  protected get editable(): boolean {
    return (
      (this.definition !== null) &&
      (!this.readOnly) &&
      (!this.$td.hasClass("to_edit"))
    );
  }

  public afterUpdate() {
    this.row.data(this.object);
    this.row.draw();
    this.$tr.removeClass("selected");
  }

  // Warning : DataTable updates object value and launch list updates !
  // this function might do really strange things !!!!
  // Use carefully
  public updateDisplayedValue(value) {
    // console.log(this.$td, this.dataTableApi.cell(this.$td).data(), value);
    this.dataTableApi.cell(this.$td).data(value);
  }
}
