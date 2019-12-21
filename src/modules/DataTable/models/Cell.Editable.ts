import $ from "jquery";
import {Observable, of} from "rxjs";
import {map, share, tap} from "rxjs/operators";
import {Cell} from "./Cell";
import {Column} from "./Column";
import {closeAction} from "./Inputs/input.component";

export class EditableCell extends Cell {
  public static fromRowAndColIndex(rowIndex, colIndex, dataTableApi): EditableCell {
    const $row = this.get$RowAtIndex(rowIndex, dataTableApi);
    const $cell = $($row.find(" > td").toArray()[colIndex]);
    if ($cell.length > 0) {
      return new EditableCell($cell, dataTableApi);
    }
    return null;
  }

  public columnDef: Column = null;

  // Open input and return Observable of changes
  public getCellUpdated$(columnDef: Column): Observable<{dirty: boolean, cell: EditableCell, action: closeAction}> {
    this.columnDef = columnDef;
    // let cellUpdated$: Observable<{dirty: boolean, cellClick: EditableCell}> = null;
    if (!this.editable) {
      return null;
    }
    if (this.pageNum !== null) {
      // noinspection TypeScriptValidateJSTypes
      this.dataTableApi.page(this.pageNum).draw(false);
    }

    const input = this.columnDef.getInput(this.object);
    if (input !== null) {
      input.appendTo(this.$td, this.value);
      this.$td.addClass("to_edit");

      return input.close$.pipe(
        tap(() => this.$td.removeClass("to_edit")),
        map(({dirty: dirty, value: value, action: action}) => {
          if (dirty) {
            // Warning : DataTable updates object value
            this.updateDisplayedValue(value);
          }
          return {dirty: dirty, cell: this, action: action};
        }),
        share(),
      );
    }
    // Direct click
    const value = !this.object[this.property];
    this.$td.removeClass("to_edit");
    this.updateDisplayedValue(value);
    return of({dirty: true, cell: this, action: null});
  }

  protected get editable(): boolean {
    return (
      (this.columnDef.type > -1) &&
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
